import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useState } from "react";
import { useAppDispatch } from "../../../hooks/hooks";
import { statisticActions } from "../../../redux/slices";

const MenuCustomAnimation = () => {
    const dispatch = useAppDispatch();
    const currentYear = new Date().getFullYear();
    const yearArray = [currentYear];
    for (let i = 1; i <= 3; i++) {
        yearArray.push(currentYear - i);
    }
    const [displayYear, setDisplayYear] = useState(currentYear);
    const handleOnChose = (year: any) => {
        setDisplayYear(year);
        setTimeout(() => {
            dispatch(statisticActions.getMoneyByMonth(Number(year)));
        }, 0);
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button className="bg-navy text-white px-4 py-2 text-sm rounded-lg"> {displayYear}</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {yearArray.map((year) => (
                    <DropdownMenuItem
                        className="hover:bg-navy/50 flex justify-center cursor-pointer"
                        id={year.toString()}
                        onClick={() => handleOnChose(year)}
                    >
                        <p>{year}</p>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export default MenuCustomAnimation;
