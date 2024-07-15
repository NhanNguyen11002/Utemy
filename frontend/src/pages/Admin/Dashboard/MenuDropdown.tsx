import * as React from "react";

import { Button } from "../../../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

type DropDownItemType = {
    text: string;
    onClickHandle?: () => void;
};
type MenuDropDownPropsType = {
    items: DropDownItemType[];
};
const MenuDropdown: React.FC<MenuDropDownPropsType> = ({ items }) => {
    const [option, setOption] = React.useState(items[0].text);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Tiêu chí</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit">
                <DropdownMenuRadioGroup value={option} onValueChange={setOption}>
                    {items.map((item: DropDownItemType, index) => {
                        return (
                            <DropdownMenuRadioItem key={index} onClick={item.onClickHandle} value={item.text}>
                                {item.text}
                            </DropdownMenuRadioItem>
                        );
                    })}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export default MenuDropdown;
