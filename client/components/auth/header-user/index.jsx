"use client";
import DropdownMenu from "@/components/dropdown-menu";
import Image from "next/legacy/image";
import Link from "next/link";
import { useState } from "react";

const HeaderUser = ({ displayName, setMenuIsOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  // _ REPLACER WITH SPACE
  function replaceUnderscoresWithSpaces(str) {
    if (!str == "") {
      return str.replace(/_/g, " ");
    } else {
      return str;
    }
  }

  return (
    <div
      onMouseLeave={() => setIsOpen(false)}
      className="border-purple-300 border-[0.1rem] h-9 rounded px-1 flex justify-center items-center transition-all duration-200 hover:bg-[#9fe2a6]"
    >
      {displayName == "" || displayName == undefined ? (
        <div className="md:text-md flex h-7 justify-center items-center gap-2">
          <Link
            onClick={() => setMenuIsOpen(-1)}
            className="text-sm cursor-pointer transition-all duration-200"
            href={"/register"}
          >
            عضویت
          </Link>
          /
          <Link
            onClick={() => setMenuIsOpen(-1)}
            className="text-sm cursor-pointer transition-all duration-200"
            href={"/login"}
          >
            ورود
          </Link>
        </div>
      ) : (
        <div className="md:text-sm h-7 flex justify-center items-center gap-1">
          <Image
            className="rounded-full"
            src={"/avatar.jpg"}
            alt="Logo"
            width={20}
            height={20}
          />
          <Link
            href={"/account"}
            className="flex cursor-pointer transition-all duration-200  gap-1 items-center"
          >
            <div className="text-xs"> صفحه شخصی </div>
            <div className="text-xs text-[#FFB000]">
              {replaceUnderscoresWithSpaces(displayName)}
            </div>
          </Link>
          <DropdownMenu
            setMenuIsOpen={setMenuIsOpen}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
      )}
    </div>
  );
};

export default HeaderUser;
