"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// // USING CONTEXT
import { useAppContext } from "@/context/app-context";

const DropdownMenu = ({ isOpen, setIsOpen, setMenuIsOpen }) => {
  const toggleMenu = () => setIsOpen(!isOpen);

  // // IF USER WANTS TO LOGED IN OR REGISTERED IT DOSEN'T HAVE TOKEN AND ITS CART SHOULD BE ZERO AND DISPLAYNAME SHOULD BE ''
  const { setDisplayName } = useAppContext();

  // LOGOUT
  const router = useRouter();
  const logouter = () => {
    Cookies.set("auth_cookie", "", { expires: 0 });
    router.push("/login");
    setIsOpen(false);
    setDisplayName("");
    setMenuIsOpen(-1);
  };

  return (
    <>
      <div className="relative">
        <div
          onMouseEnter={() => toggleMenu()}
          onClick={() => toggleMenu()}
          className="cursor-pointer transition-all duration-200 z-50 p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 font-bold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        {isOpen && (
          <div
            onMouseLeave={() => toggleMenu()}
            className="absolute w-36 z-50 top-5 -left-40 md:-left-2 rounded shadow-lg bg-white"
          >
            <div className="block p-1 text-sm hover:bg-gray-100">
              <ul className="flex flex-col gap-1">
                <li
                  onClick={() => {
                    router.push("/account/info");
                    setIsOpen(false);
                    setMenuIsOpen(-1);
                  }}
                  className="rounded flex justify-center items-center cursor-pointer transition-all duration-200 hover:bg-indigo-200 text-sm h-8 bg-indigo-100"
                >
                  اطلاعات
                </li>
                <li
                  onClick={() => {
                    router.push("/account/comments");
                    setIsOpen(false);
                    setMenuIsOpen(-1);
                  }}
                  className="rounded flex justify-center items-center cursor-pointer transition-all duration-200 hover:bg-indigo-200 text-sm h-8 bg-indigo-100"
                >
                  دیدگاهها
                </li>
                <li
                  onClick={logouter}
                  className="rounded flex justify-center items-center cursor-pointer transition-all duration-200 hover:bg-indigo-200 text-sm h-8 bg-indigo-100"
                >
                  خروج
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DropdownMenu;
