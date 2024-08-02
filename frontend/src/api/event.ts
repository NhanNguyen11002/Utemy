import { GetEventsWithPagination } from "@/types/event";
import apiCaller from "../api-config/apiCaller";

const createEvent = async (values: FormData)=> {
    const path ="event/";
    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const updateEvent = async (event_id: number, values: FormData)=> {
    const path =`event/${event_id}`;
    const reponse = await apiCaller("PATCH", path, values);
    return reponse;
};
const deleteEvent = async (event_id: number)=> {
    const path =`event/${event_id}`;
    const reponse = await apiCaller("DELETE", path);
    return reponse;
};
const getEventById = async (event_id: number)=> {
    const path =`event/${event_id}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getEventsWithPagination = async (values: GetEventsWithPagination) => {
    const path = `event/all?search_item=${values.searchItem}&page_index=${values.pageIndex}`;

    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getAllEvents = async ()=> {
    const path =`event/allevent`;
    const reponse = await apiCaller("GET", path);
    return reponse;
}
const getActiveEvent = async ()=> {
    const path =`event/is/active`;
    const reponse = await apiCaller("GET", path);
    return reponse;
}
const eventApis = {
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsWithPagination,
    getAllEvents,
    getEventById,
    getActiveEvent
};

export default eventApis;