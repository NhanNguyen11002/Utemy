const error = {
    //etc
    ERROR_INTERNAL_SERVER: "Internal server",
    ERROR_BAD_REQUEST: " Bad request",
    ERROR_UNAUTHORIZED: "Unauthorized",
    ERROR_MISSING_REQUEST_BODY: "Missing request body",
    ERROR_DATA_NOT_FOUND: "Data not found",
    ERROR_LOGIN_AGAIN: "Please login again",
    //confirm password
    ERROR_CONFIRM_PASSWORD: "Confirm password and password must be the same",
    ERROR_CONFIRM_NEW_PASSWORD: "Confirm password and new password must be the same",
    ERROR_CONFIRM_PASSWORD_REQUIRED: "Confirm password is required",
    //email
    ERROR_EMAIL_USED: "Email is already used",
    ERROR_ALREADY_VERIFY: "Email is already verified",
    ERROR_EMAIL_STRING: "Email must be a string",
    ERROR_EMAIL_REQUIRED: "Email is required",
    ERROR_EMAIL_FORMAT: "Email is wrong format, Ex: example@gmail.com",
    ERROR_EMAIL_MAX: "Email must be under 50 chars",
    //password
    ERROR_PASSWORD_STRING: "Password must be string",
    ERROR_PASSWORD_REQUIRED: "Password is required",
    ERROR_PASSWORD_MAX: "Password must be under 20 chars",
    ERROR_PASSWORD_MIN: "Password must be more than 8 chars",
    ERROR_WRONG_PASSWORD: "Wrong password",
    // current passsword
    ERROR_CURRENT_PASSWORD_STRING: "Current password must be string",
    ERROR_CURRENT_PASSWORD_REQUIRED: "Current password is required",
    ERROR_CURRENT_PASSWORD_MAX: "Current password must be under 20 chars",
    ERROR_CURRENT_PASSWORD_MIN: "Current password must be more than 8 chars",
    ERROR_WRONG_CURRENT_PASSWORD: "Wrong current password",
    //new password
    ERROR_NEW_PASSWORD_STRING: "New password must be string",
    ERROR_NEW_PASSWORD_REQUIRED: "New password is required",
    ERROR_NEW_PASSWORD_MAX: "New password must be under 20 chars",
    ERROR_NEW_PASSWORD_MIN: "New password must be more than 8 chars",
    //token
    ERROR_BAD_TOKEN: "Bad token",
    ERROR_TOKEN_STRING: "Token must be a string",
    ERROR_TOKEN_REQUIRED: "Token is REQUIRED",
    //first name
    ERROR_FIRST_NAME_STRING: "First name must be string",
    ERROR_FIRST_NAME_REQUIRED: "First name is required",
    ERROR_FIRST_NAME_MAX: "First name must be under 30 chars",
    //last name
    ERROR_LAST_NAME_STRING: "Last name must be string",
    ERROR_LAST_NAME_REQUIRED: "Last name is REQUIRED",
    ERROR_LAST_NAME_MAX: "Last name must be under 30 chars",
    //user
    ERROR_USER_NOT_FOUND: "Wrong email or user doesn't exist",
    ERROR_ROLE_REQUIRED: "Role is required",
    //category
    ERROR_CATEGORY_NOT_FOUND: "Category doesn't exist",
    //lesson
    ERROR_LESSON_NOT_FOUND: "Lesson doesn't exist",

    //description
    ERROR_DESCRIPTION_STRING: "Description must be string",
    ERROR_DESCRIPTION_REQUIRED: "Description is required",
    ERROR_DESCRIPTION_TOO_MAX: "Description is too long",
    ERROR_DESCRIPTION_TOO_SHORT: "Description is too short",

    //course
    ERROR_COURSE_NOT_FOUND: "Course not found",
    ERROR_COURSE_TITLE_REQUIRED: "Course's title is required",
    ERROR_COURSE_TITLE_STRING: "Course's title must be string",
    ERROR_COURSE_TITLE_TOO_LONG: "Course's title is too long",
    ERROR_COURSE_ID_REQUIRED: "Course's ID is required",
    ERROR_COURSE_ID_NUMBER: "Course's ID must be a number",
    ERROR_COURSE_ID_INTEGER: "Course's ID must be integer",
    ERROR_COURSE_SLUG_REQUIRED: "Course's slug is required",
    ERROR_COURSE_SLUG_STRING: "Course's slug must be string",
    ERROR_COURSE_SLUG_MALFORMED: "Course's slug is malformed",
    ERROR_COURSE_STATUS_REQUIRED: "Course's status is required",
    ERROR_COURSE_STATUS_BOOLEAN: "Course's status must be boolean",
    ERROR_COURSE_DESCRIPTION_REQUIRED: "Course's description is required",
    ERROR_COURSE_DESCRIPTION_STRING: "Course's description must be string",
    ERROR_COURSE_SUMMARY_REQUIRED: "Course's summary is required",
    ERROR_COURSE_SUMMARY_STRING: "Course's summary must be string",
    ERROR_COURSE_CATEGORIES_REQUIRED: "Course's categories is required",
    ERROR_COURSE_THUMBNAIL_REQUIRED: "Course's thumbnail is required",
    ERROR_COURSE_TRAILER_REQUIRED: "Course's trailer is required",
    ERROR_COURSE_PRICE_REQUIRED: "Price is required",
    ERROR_COURSE_PRICE_NUMBER: "Price must be number",
    ERROR_CREATE_COURSE_FAILED: "Create course failed",
    ERROR_COURSE_SUMMARY_MAX: "Summry is too long",
    ERROR_CATEGORY_MAX: "Maximum is 4 categories",
    ERROR_CATEGORY_REQUIRED: "Atleast 1 category",
    ERROR_IMAGE_TOO_BIG: "Image is too big, maximum 4 MB",
    ERROR_IMAGE_NOT_SUPPORTED: "Wrong image type, JPG JPEG PNG only",
    ERROR_VIDEO_TOO_BIG: "Video is too big, maximum 100 MB",
    ERROR_VIDEO_NOT_SUPPORTED: "Wrong video type, MP4 MOV MKV only",
    ERROR_VIDEO_IS_REQUIRED: "Video is required",

    //rating
    ERROR_RATING_NOT_FOUND: "Rating doesn't exist",
    ERROR_ALREADY_RATING: "You have already rated this course",
    ERROR_RATING_SCORE_REQUIRED: "Score is required",
    ERROR_RATING_SCORE_MAX: "Score must be lower than 5",
    ERROR_RATING_SCORE_MIN: "Score must be higher than 0",
    ERROR_RATING_SCORE_INT: "Score must be an integer",
    ERROR_RATING_CONTENT_MAX: "Content must be lower than 300 chars",
    ERROR_RATING_CONTENT_STRING: "Content must be a string",
    ERROR_RATING_ID_REQUIRED: "Rating id is required",
    ERROR_RATING_ID_INT: "Rating id must be an integer",
    ERROR_RATING_ID_NUMBER: "Rating id must be a number",

    //section
    ERROR_SECTION_NOT_FOUND: "Section not found",
    ERROR_SECTION_ID_REQUIRED: "Section's ID is required",
    ERROR_SECTION_ID_NUMBER: "Section's ID must be a number",
    ERROR_SECTION_ID_INTEGER: "Section's ID must be integer",

    //category
    ERROR_CATEGORY_ID_NUMBER: "Category id must be an integer",
    ERROR_CATEGORY_ID_REQUIRED: "Category id is required",
    ERROR_CATEGORY_IMAGE_REQUIRED: "Category image is required",
    ERROR_TITLE_STRING: "Title must be string",
    ERROR_TITLE_REQUIRED: "Title is required",
    ERROR_DURATION_REQUIRED: "Duration is required",
    ERROR_PASS_PERCENT_REQUIRED: "Pass percent required",
    ERROR_IS_TIME_LIMIT_REQUIRED: "Time limit option required",
    ERROR_QUIZ_GROUP_ID_REQUIRED: "Quiz is required",
    ERROR_TITLE_MAX: "Title must be under 50 chars",
    ERROR_CATEGORY_ALREADY_EXISTS: "Category is already existed",

    //promotion
    ERROR_SALE_PRICE_NUMBER: "Sale price must be a number",
    ERROR_SALE_PRICE_REQUIRED: "Sale price is required",
    ERROR_SALE_UNTIL_MIN: "Sale until must be later than today",
    ERROR_SALE_UNTIL_REQUIRED: "Sale until is required",
    ERROR_SALE_UNTIL_DATE: "Sale until must be a date",
    ERROR_SALE_MORE_EXP_THAN_PRICE: "Sale price must be cheaper than original price",

    ERROR_VALIDATION_FAILED: "Validation failed",

    ERROR_GET_COURSE_FAILED: "Get course failed",
    ERROR_TYPE_REQUIRED: "Type is required",

    //coupon
    ERROR_CODE_REQUIRED: "Code is required",
    ERROR_CODE_MAX: "Code must be under than 30 chars",
    ERROR_CODE_MIN: "Code must be upper than 8 chars",
    ERROR_DISCOUNT_MAX: "Discount must less than 100",
    ERROR_DISCOUNT_MIN: "Discount must more than 0",
    ERROR_DISCOUNT_REQUIRED: "Discount is required",
    ERROR_REMAIN_QUANTITY_REQUIRED: "Remain_quantity is required",
    ERROR_VALID_UNTIL_LATER_VALID_START: "Valid until must be later than Valid start",
    ERROR_VALID_START_EARLIER_VALID_UNTIL: "Valid until must be later than Valid start",
    ERROR_VALID_START_REQUIRED: "Valid start is required",
    ERROR_VALID_UNTIL_REQUIRED: "Valid until is required",

    //event
    ERROR_NAME_REQUIRED: "Name is required",
    ERROR_NAME_MAX: "Name must be under than 50 chars",
    ERROR_DESCRIPTION_EVENT_REQUIRED: "Description is required",
    ERROR_DESCRIPTION_EVENT_MAX: "Description must be under 150 chars",
    ERROR_DESCRIPTION_EVENT_MIN: "Description must be upper 8 chars",
    ERROR_END_DATE_LATER_START_DATE: "End date must be later than start date",
    ERROR_START_DATE_EARLIER_END_DATE: "Start date must be earlier than end date",
    ERROR_START_DATE_REQUIRED: "Start date is required",
    ERROR_END_DATE_REQUIRED: "End date is required",

    //
    ERROR_QUESTION_REQUIRED: "Question is required",
};
export default error;
