const error = {
    //etc
    ERROR_COUPON_USED: "Coupon is already used",
    ERROR_INTERNAL_SERVER: "Internal server",
    ERROR_BAD_REQUEST: " Bad request",
    ERROR_UNAUTHORIZED: "Unauthorized",
    ERROR_MISSING_REQUEST_BODY: "Missing request body",
    ERROR_DATA_NOT_FOUND: "Data not found",
    ERROR_LOGIN_AGAIN: "Please login again",
    ERROR_VALIDATION_FAILED: "Validation failed",
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
    ERROR_PASSWORD_MIN: "Password must be more than 20 chars",
    ERROR_WRONG_PASSWORD: "Wrong password",
    // current passsword
    ERROR_CURRENT_PASSWORD_STRING: "Current password must be string",
    ERROR_CURRENT_PASSWORD_REQUIRED: "Current password is required",
    ERROR_CURRENT_PASSWORD_MAX: "Current password must be under 20 chars",
    ERROR_CURRENT_PASSWORD_MIN: "Current password must be more than 20 chars",
    ERROR_WRONG_CURRENT_PASSWORD: "Wrong current password",
    //new password
    ERROR_NEW_PASSWORD_STRING: "New password must be string",
    ERROR_NEW_PASSWORD_REQUIRED: "New password is required",
    ERROR_NEW_PASSWORD_MAX: "New password must be under 20 chars",
    ERROR_NEW_PASSWORD_MIN: "New password must be more than 20 chars",
    //token
    ERROR_BAD_TOKEN: "Bad token",
    ERROR_TOKEN_STRING: "Token must be a string",
    ERROR_TOKEN_REQUIRED: "Token is REQUIRED",
    //first name
    ERROR_FIRST_NAME_STRING: "First name must be string",
    ERROR_FIRST_NAME_REQUIRED: "First name is requrie",
    ERROR_FIRST_NAME_MAX: "First name must be under 30 chars",
    //last name
    ERROR_LAST_NAME_STRING: "Last name must be string",
    ERROR_LAST_NAME_REQUIRED: "Last name is REQUIRED",
    ERROR_LAST_NAME_MAX: "Last name must be under 30 chars",
    //user
    ERROR_USER_NOT_FOUND: "Wrong email or user doesn't exist",
    //category
    ERROR_CATEGORY_NOT_FOUND: "Category doesn't exist",
    //lesson
    ERROR_LESSON_NOT_FOUND: "Lesson doesn't exist",

    //description
    ERROR_DESCRIPTION_STRING: "Description must be string",
    ERROR_DESCRIPTION_REQUIRED: "Description is required",
    ERROR_DESCRIPTION_TOO_MAX: "Description is too long",
    ERROR_DESCRIPTION_TOO_SHORT: "Description is too short",

    // lecture
    ERROR_LECTURE_TYPE_REQUIRED: "Type is required",
    ERROR_LECTURE_TYPE_STRING: " Type must be string",
    ERROR_LECTURE_TYPE_TOO_LONG: "Type is too long",
    ERROR_LECTURE_DURATION_REQUIRED: "Duration is required",
    ERROR_LECTURE_DURATION_NUMBER: " Duration must be number",
    ERROR_LECTURE_DURATION_POSITIVE: " Duration must be positive",
    ERROR_LECTURE_PASS_PERCENT_POSITIVE: " Pass percent must be positive",
    ERROR_LECTURE_TIME_LIMIT_BOOLEAN: " Time limit must be a boolean",
    ERROR_QUIZ_GROUP_ID: "Quiz group id must be a number",
    ERROR_QUIZ_GROUP_ID_INT: "Quiz group id must be an int",
    ERROR_LECTURE_NOT_FOUND: "Lecture not found",
    ERROR_LECTURE_ID_REQUIRED: "Lecture's ID is required",
    ERROR_LECTURE_ID_NUMBER: "Lecture's ID must be a number",
    ERROR_LECTURE_ID_INTEGER: "Lecture's ID must be integer",

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
    ERROR_COURSE_PRICE_REQUIRED: "Price is required",
    ERROR_COURSE_PRICE_NUMBER: "Price must be number",
    ERROR_COURSE_PRICE_POSITIVE: "Price must be positive number",
    ERROR_CREATE_COURSE_FAILED: "Create course failed",
    ERROR_GET_COURSE_FAILED: "Get course failed",

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
    ERROR_TITLE_STRING: "Title must be string",
    ERROR_TITLE_REQUIRED: "Title is required",
    ERROR_TITLE_MAX: "Title must be under 50 chars",
    ERROR_CATEGORY_ALREADY_EXISTS: "Category is already existed",

    //promotion
    ERROR_SALE_PRICE_NUMBER: "Sale price must be a number",
    ERROR_SALE_PRICE_REQUIRED: "Sale price is required",
    ERROR_SALE_UNTIL_MIN: "Sale until must be later than today",
    ERROR_SALE_UNTIL_REQUIRED: "Sale until is required",
    ERROR_SALE_UNTIL_DATE: "Sale until must be a date",
    ERROR_SALE_MORE_EXP_THAN_PRICE: "Sale price must be cheaper than original price",

    //cart
    ERROR_ALREADY_IN_CART: "Course already in cart",
    ERROR_ALREADY_ENROLLED: "Course already enrolled ",
    ERROR_COURSE_NOT_FOUND_IN_CART: "Course not found in cart",
    ERROR_CART_NOT_FOUND: "Cart not found",

    //Invoice
    ERROR_INVOICE_NOT_FOUND: "Invoice not found",

    //Event
    ERROR_EVENT_NOT_FOUND: "Event is finished or not found",
    ERROR_EVENT_IN_BETWEEN: "There is another event in this period of time,",
    ERROR_EXIST_ACTIVE_EVENT: "There was an actived event before so cannot create another event",

    // History Spin
    ERROR_HISTORY_SPIN_NOT_FOUND: "This user doesn't have history spin for this event before",
};
export default error;
