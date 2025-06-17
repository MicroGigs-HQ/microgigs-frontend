/* ------------------------------------------------------------------
   hooks/useUserNotifications.ts
   – subscribes to on‑chain Notify events and keeps React state fresh
------------------------------------------------------------------- */
import { useEffect, useState, useMemo } from "react";
import { Address, decodeEventLog, parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";

/** ───── 1.  TypeScript shape for callers ────────────────────────── */
export interface AppNotification {
  id: string; // txHash+logIndex (unique)
  title: string;
  body: string;
  icon?: string; // optional url / ipfs cid
  typeCode: number; // 0=task update, 1=message, 2=platform …
  timestamp: bigint; // seconds since epoch
  read?: boolean; // UI only – not stored on‑chain
}

/** ───── 2.  ABI for the Notify event (👇 must match your contract) */
const notifyEvent = parseAbiItem(
  "event Notify(address indexed user, string title, string body, string icon, uint8 typeCode, uint256 ts)"
);

/** ───── 3.  Hook implementation ────────────────────────────────── */
export function useUserNotifications(
  hubAddress: Address, // your NotificationHub / Factory
  userAddress?: Address
) {
  const publicClient = usePublicClient();

  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // helper to turn a raw log into our TS object
  const decode = (log: any): AppNotification => {
    const { args } = decodeEventLog({
      abi: [notifyEvent],
      eventName: "Notify",
      ...log,
    });
    return {
      id: `${log.transactionHash}-${log.logIndex}`,
      title: (args as any).title,
      body: (args as any).body,
      icon: (args as any).icon,
      typeCode: Number((args as any).typeCode),
      timestamp: (args as any).ts,
      read: false,
    };
  };

  /** 3‑A ▪ initial fetch of history (last 100 emits for that user) */
  useEffect(() => {
    if (!userAddress || !publicClient) return;
    const run = async () => {
      try {
        setLoading(true);

        const logs = await publicClient.getLogs({
          address: hubAddress,
          event: notifyEvent,
          args: { user: userAddress },
          fromBlock: "earliest",
          toBlock: "latest",
        });

        const mapped = logs.map(decode).reverse(); // newest first
        setNotifs(mapped);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [hubAddress, publicClient, userAddress]);

  /** 3‑B ▪ real‑time updates via viem’s log subscription              */
  useEffect(() => {
    if (!userAddress) return;

    const unwatch = publicClient?.watchEvent({
      address: hubAddress,
      event: notifyEvent,
      args: { user: userAddress },
      onLogs: (logs) => {
        setNotifs((prev) => [...logs.map(decode), ...prev]);
      },
    });

    return () => unwatch?.();
  }, [hubAddress, publicClient, userAddress]);

  /** 3‑C ▪ consumer helpers                                          */
  const unreadCount = useMemo(
    () => notifs.filter((n) => !n.read).length,
    [notifs]
  );

  const markAsRead = (id: string) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  return {
    notifications: notifs,
    loadingNotifications: loading,
    errorNotifications: error,
    unreadCount,
    markAsRead,
  };
}
