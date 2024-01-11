import { Menu, MenuHandler, MenuList, MenuItem, Button } from "@material-tailwind/react";
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
        <Menu
            animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
            }}
        >
            <MenuHandler>
                <Button className="bg-navy"> {displayYear}</Button>
            </MenuHandler>
            <MenuList>
                {yearArray.map((year) => (
                    <MenuItem className="hover:bg-navy/50" id={year.toString()} onClick={() => handleOnChose(year)}>
                        {year}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};
export default MenuCustomAnimation;
