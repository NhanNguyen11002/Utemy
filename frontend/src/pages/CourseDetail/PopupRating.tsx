import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { RatingCourse as RatingCourseType, Rating, EditRating } from "../../types/rating";
import RatingInPopup from "./RatingInPopup";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { ratingActions } from "../../redux/slices";
import toast, { Toaster } from "react-hot-toast";
import { ratingValidationSchema } from "../../validations/rating";
import { DeleteModal } from "../../components";

type RatingCourseProps = {
    handleAfterVote: () => void;
    handleCancel: () => void;
    course_id: number | undefined;
};

const PopupRating: React.FC<RatingCourseProps> = (props) => {
    const course_id = props.course_id;
    const [isDisplayDelete, setIsDisplayDelete] = useState(false);
    const rating: Rating = useAppSelector((state) => state.ratingSlice.rating);
    const [checked, setChecked] = useState(rating.score || 5);
    const formikRef = useRef(null);
    const dispatch = useAppDispatch();
    const initialValue = {
        content: rating.content || "",
    };
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const handleCheck = (event: any) => {
        const rating = event.target.id;
        setChecked(Number(rating));
    };
    useEffect(() => {
        dispatch(ratingActions.getUserRating(course_id as number)).then((response) => {
            if (response.payload?.status_code === 404) {
                dispatch(ratingActions.setDeleteRating());
                setChecked(5);
            }
        });
    }, [course_id]);
    const handleOnSubmit = (values: any) => {
        if (rating.id) {
            const data: EditRating = {
                ...values,
                rating_id: rating.id,
                score: checked,
            };
            dispatch(ratingActions.editRating(data)).then((response) => {
                if (response.payload?.status_code === 200) {
                    toast.success(response.payload.message);
                    dispatch(ratingActions.getUserRating(course_id as number));
                    props.handleCancel();
                    props.handleAfterVote();
                } else {
                    toast.error(response.payload?.message as string);
                }
            });
        } else {
            const data: RatingCourseType = {
                ...values,
                course_id,
                score: checked,
            };
            dispatch(ratingActions.ratingCourse(data)).then((response) => {
                if (response.payload?.status_code === 200) {
                    toast.success(response.payload.message);
                    dispatch(ratingActions.getUserRating(course_id as number));
                    props.handleCancel();
                    props.handleAfterVote();
                } else {
                    toast.error(response.payload?.message as string);
                }
            });
        }
    };
    const handleToggleDelete = () => {
        setIsDisplayDelete(!isDisplayDelete);
    };
    const handleDeleteRating = () => {
        dispatch(ratingActions.deleteRating(Number(rating.id))).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(ratingActions.setDeleteRating());
                handleToggleDelete();
                props.handleCancel();
                props.handleAfterVote();
            } else {
                toast.error(response.payload?.message as string);
            }
        });
    };

    return (
        <>
            <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
                {isDisplayDelete && <DeleteModal handleDelete={handleDeleteRating} handleCancel={handleToggleDelete} />}
                <Toaster />
                <div className="  max-w-[360px] tablet:max-w-[550px] max-h-[630px] tablet:max-h-[1000px] rounded-[12px] bg-background mx-auto tablet:mx-0 flex-1">
                    <div className="w-full p-[12px]">
                        <Formik
                            validationSchema={ratingValidationSchema}
                            initialValues={initialValue}
                            onSubmit={handleOnSubmit}
                            innerRef={formikRef}
                            enableReinitialize={true}
                        >
                            {(formik) => (
                                <form
                                    onSubmit={formik.handleSubmit}
                                    className="text-sm mb-1 tablet:text-xl font-medium"
                                >
                                    <div className="px-5 py-3 flex items-center space-x-4">
                                        <label htmlFor="title" className="text-sm mb-1 tablet:text-xl font-medium">
                                            Vote: {checked}
                                        </label>
                                        <RatingInPopup score={checked} handleCheck={handleCheck} />
                                    </div>
                                    <div className="px-5 py-3">
                                        <label htmlFor="title" className="text-sm mb-1 tablet:text-xl font-medium">
                                            Comment:
                                        </label>
                                        <br />
                                        <Field
                                            as="textarea"
                                            name="content"
                                            className={` w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
                                                formik.errors.content && formik.touched.content && "border-error"
                                            } `}
                                        />
                                        <br />
                                        <ErrorMessage
                                            name="content"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>

                                    <div className="flex justify-end px-4">
                                        <button
                                            type="submit"
                                            name="save_button"
                                            className="btn btn-info text-white text-lg"
                                        >
                                            {isLoading ? "Loading..." : "Save"}
                                        </button>
                                        <button
                                            onClick={handleToggleDelete}
                                            type="button"
                                            className={` btn btn-error text-lg ml-2 ${rating.id ? "" : "hidden"} `}
                                        >
                                            {isLoading ? "Loading..." : "Delete"}
                                        </button>
                                        <button onClick={props.handleCancel} type="button" className="btn text-lg ml-2">
                                            {isLoading ? "Loading..." : "Cancel"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PopupRating;
