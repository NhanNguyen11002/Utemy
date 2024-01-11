import apiCaller from "../api-config/apiCaller";
import { AddSection, EditSection } from "../types/section";

const getAllSectionByCourseId = async (values: string) => {
    const path = `section/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const addSection = async (values: AddSection) => {
    const path = `section`;
    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const deleteSection = async (values: number) => {
    const path = `section/${values}`;
    const reponse = await apiCaller("DELETE", path);
    return reponse;
};
const editSection = async (values: EditSection) => {
    const path = `section/`;
    const reponse = await apiCaller("PATCH", path, values);
    return reponse;
};

const sectionApis = {
    getAllSectionByCourseId,
    addSection,
    deleteSection,
    editSection,
};

export default sectionApis;
