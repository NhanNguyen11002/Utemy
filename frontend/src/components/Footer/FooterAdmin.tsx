import { HeartIcon } from "@heroicons/react/24/solid";

export function FooterAdmin() {
    const year = new Date().getFullYear();

    return (
        <footer className="py-2">
            <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
                <p className="font-normal text-sm text-inherit">
                    &copy; {year}, made with <HeartIcon className="-mt-0.5 inline-block h-3.5 w-3.5 text-red-600" /> by{" "}
                    <a href={"/"} className="transition-colors hover:text-blue-500 font-bold">
                        Utemy{" "}
                    </a>
                    for a better web.
                </p>
                <ul className="flex items-center gap-4">
                    <li key={"about"}>
                        <a
                            href={"https://www.facebook.com/profile.php?id=100040927081687"}
                            className="py-0.5 px-1 font-normal text-inherit text-sm transition-colors hover:text-blue-500"
                        >
                            Về chúng tôi
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
}

export default FooterAdmin;
