import Image from "next/image";
import SearchBar from "@/components/ui/search-bar";
import type React from "react";

export default function Header() {
    return (
        <header className="sticky top-0 z-10 bg-white border-b-2 border-gray-200">
            <div className="py-6 px-10">
                <div className="flex flex-col space-y-3 justify-center w-full">
                    <div className="flex justify-center">
                        <Image src="microgigs-logo.svg" alt="logo" width={120} height={32} />
                    </div>
                    <div className="flex space-x-3 justify-start items-center mt-1">
                        <Image src="profile.png" alt="profile-pic" width={36} height={36} />
                        <div className="flex flex-col">
                            <h3 className="capitalize font-semibold text-base text-[#181818]">Gm, Weng✋🏻</h3>
                            <p className="text-[10px] text-slate-400">What are we making today?</p>
                        </div>
                    </div>
                    <SearchBar />
                </div>
            </div>
        </header>
    )
}