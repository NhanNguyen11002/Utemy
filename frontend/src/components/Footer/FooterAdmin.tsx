import { Typography } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/solid";

export function FooterAdmin() {
    const year = new Date().getFullYear();

    return (
        <footer className="py-2">
            <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
                <Typography variant="small" className="font-normal text-inherit">
                    &copy; {year}, made with <HeartIcon className="-mt-0.5 inline-block h-3.5 w-3.5 text-red-600" /> by{" "}
                    <a href={"/"} target="_blank" className="transition-colors hover:text-blue-500 font-bold">
                        Utemy{" "}
                    </a>
                    for a better web.
                </Typography>
                <ul className="flex items-center gap-4">
                    <li key={"about"}>
                        <Typography
                            as="a"
                            href={"https://www.facebook.com/profile.php?id=100040927081687"}
                            target="_blank"
                            variant="small"
                            className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500"
                        >
                            Về chúng tôi
                        </Typography>
                    </li>
                </ul>
            </div>
        </footer>
    );
}

export default FooterAdmin;
