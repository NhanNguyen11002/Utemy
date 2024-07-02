const error = {
    //etc
    ERROR_INTERNAL_SERVER: "Lỗi máy chủ nội bộ",
    ERROR_BAD_REQUEST: "Yêu cầu không hợp lệ",
    ERROR_UNAUTHORIZED: "Chưa xác thực",
    ERROR_MISSING_REQUEST_BODY: "Thiếu nội dung yêu cầu",
    ERROR_DATA_NOT_FOUND: "Dữ liệu không tìm thấy",
    ERROR_LOGIN_AGAIN: "Vui lòng đăng nhập lại",
    //confirm password
    ERROR_CONFIRM_PASSWORD: "Mật khẩu xác nhận và mật khẩu phải giống nhau",
    ERROR_CONFIRM_NEW_PASSWORD: "Mật khẩu xác nhận và mật khẩu mới phải giống nhau",
    ERROR_CONFIRM_PASSWORD_REQUIRED: "Phải nhập mật khẩu xác nhận",
    //email
    ERROR_EMAIL_USED: "Email đã được sử dụng",
    ERROR_ALREADY_VERIFY: "Email đã được xác minh",
    ERROR_EMAIL_STRING: "Email phải là một chuỗi",
    ERROR_EMAIL_REQUIRED: "Phải nhập email",
    ERROR_EMAIL_FORMAT: "Định dạng email không hợp lệ, VD: example@gmail.com",
    ERROR_EMAIL_MAX: "Email phải dưới 50 ký tự",
    //password
    ERROR_PASSWORD_STRING: "Mật khẩu phải là một chuỗi",
    ERROR_PASSWORD_REQUIRED: "Phải nhập mật khẩu",
    ERROR_PASSWORD_MAX: "Mật khẩu phải dưới 20 ký tự",
    ERROR_PASSWORD_MIN: "Mật khẩu phải nhiều hơn 8 ký tự",
    ERROR_WRONG_PASSWORD: "Mật khẩu sai",
    // current password
    ERROR_CURRENT_PASSWORD_STRING: "Mật khẩu hiện tại phải là một chuỗi",
    ERROR_CURRENT_PASSWORD_REQUIRED: "Phải nhập mật khẩu hiện tại",
    ERROR_CURRENT_PASSWORD_MAX: "Mật khẩu hiện tại phải dưới 20 ký tự",
    ERROR_CURRENT_PASSWORD_MIN: "Mật khẩu hiện tại phải nhiều hơn 8 ký tự",
    ERROR_WRONG_CURRENT_PASSWORD: "Mật khẩu hiện tại sai",
    //new password
    ERROR_NEW_PASSWORD_STRING: "Mật khẩu mới phải là một chuỗi",
    ERROR_NEW_PASSWORD_REQUIRED: "Phải nhập mật khẩu mới",
    ERROR_NEW_PASSWORD_MAX: "Mật khẩu mới phải dưới 20 ký tự",
    ERROR_NEW_PASSWORD_MIN: "Mật khẩu mới phải nhiều hơn 8 ký tự",
    //token
    ERROR_BAD_TOKEN: "Token không hợp lệ",
    ERROR_TOKEN_STRING: "Token phải là một chuỗi",
    ERROR_TOKEN_REQUIRED: "Token là bắt buộc",
    //first name
    ERROR_FIRST_NAME_STRING: "Tên phải là một chuỗi",
    ERROR_FIRST_NAME_REQUIRED: "Phải nhập tên",
    ERROR_FIRST_NAME_MAX: "Tên phải dưới 30 ký tự",
    //last name
    ERROR_LAST_NAME_STRING: "Họ phải là một chuỗi",
    ERROR_LAST_NAME_REQUIRED: "Phải nhập họ",
    ERROR_LAST_NAME_MAX: "Họ phải dưới 30 ký tự",
    //user
    ERROR_USER_NOT_FOUND: "Email sai hoặc người dùng không tồn tại",
    ERROR_ROLE_REQUIRED: "Phải nhập vai trò",
    //category
    ERROR_CATEGORY_NOT_FOUND: "Danh mục không tồn tại",
    //lesson
    ERROR_LESSON_NOT_FOUND: "Bài học không tồn tại",

    //description
    ERROR_DESCRIPTION_STRING: "Mô tả phải là một chuỗi",
    ERROR_DESCRIPTION_REQUIRED: "Phải nhập mô tả",
    ERROR_DESCRIPTION_TOO_MAX: "Mô tả quá dài, chỉ được 200 ký tự",
    ERROR_DESCRIPTION_TOO_SHORT: "Mô tả quá ngắn",

    //course
    ERROR_COURSE_NOT_FOUND: "Không tìm thấy khóa học",
    ERROR_COURSE_TITLE_REQUIRED: "Phải nhập tiêu đề của khóa học",
    ERROR_COURSE_TITLE_STRING: "Tiêu đề của khóa học phải là một chuỗi",
    ERROR_COURSE_TITLE_TOO_LONG: "Tiêu đề của khóa học quá dài",
    ERROR_COURSE_ID_REQUIRED: "Phải nhập ID của khóa học",
    ERROR_COURSE_ID_NUMBER: "ID của khóa học phải là một số",
    ERROR_COURSE_ID_INTEGER: "ID của khóa học phải là số nguyên",
    ERROR_COURSE_SLUG_REQUIRED: "Phải nhập slug của khóa học",
    ERROR_COURSE_SLUG_STRING: "Slug của khóa học phải là một chuỗi",
    ERROR_COURSE_SLUG_MALFORMED: "Slug của khóa học không hợp lệ",
    ERROR_COURSE_STATUS_REQUIRED: "Phải nhập trạng thái của khóa học",
    ERROR_COURSE_STATUS_BOOLEAN: "Trạng thái của khóa học phải là boolean",
    ERROR_COURSE_DESCRIPTION_REQUIRED: "Phải nhập mô tả của khóa học",
    ERROR_COURSE_DESCRIPTION_STRING: "Mô tả của khóa học phải là một chuỗi",
    ERROR_COURSE_SUMMARY_REQUIRED: "Phải nhập tóm tắt của khóa học",
    ERROR_COURSE_SUMMARY_STRING: "Tóm tắt của khóa học phải là một chuỗi",
    ERROR_COURSE_CATEGORIES_REQUIRED: "Phải nhập danh mục của khóa học",
    ERROR_COURSE_THUMBNAIL_REQUIRED: "Phải nhập ảnh đại diện của khóa học",
    ERROR_COURSE_TRAILER_REQUIRED: "Phải nhập trailer của khóa học",
    ERROR_COURSE_PRICE_REQUIRED: "Phải nhập giá",
    ERROR_COURSE_PRICE_NUMBER: "Giá phải là số",
    ERROR_CREATE_COURSE_FAILED: "Tạo khóa học thất bại",
    ERROR_COURSE_SUMMARY_MAX: "Tóm tắt quá dài",
    ERROR_CATEGORY_MAX: "Tối đa là 4 danh mục",
    ERROR_CATEGORY_REQUIRED: "Phải có ít nhất 1 danh mục",
    ERROR_IMAGE_TOO_BIG: "Hình ảnh quá lớn, tối đa là 4 MB",
    ERROR_IMAGE_NOT_SUPPORTED: "Loại hình ảnh không đúng, chỉ chấp nhận JPG JPEG PNG",
    ERROR_VIDEO_TOO_BIG: "Video quá lớn, tối đa là 100 MB",
    ERROR_VIDEO_NOT_SUPPORTED: "Loại video không đúng, chỉ chấp nhận MP4 MOV MKV",
    ERROR_VIDEO_IS_REQUIRED: "Phải nhập video",

    //rating
    ERROR_RATING_NOT_FOUND: "Đánh giá không tồn tại",
    ERROR_ALREADY_RATING: "Bạn đã đánh giá khóa học này",
    ERROR_RATING_SCORE_REQUIRED: "Phải nhập điểm",
    ERROR_RATING_SCORE_MAX: "Điểm phải dưới 5",
    ERROR_RATING_SCORE_MIN: "Điểm phải trên 0",
    ERROR_RATING_SCORE_INT: "Điểm phải là số nguyên",
    ERROR_RATING_CONTENT_MAX: "Nội dung phải dưới 300 ký tự",
    ERROR_RATING_CONTENT_STRING: "Nội dung phải là một chuỗi",
    ERROR_RATING_ID_REQUIRED: "Phải nhập ID của đánh giá",
    ERROR_RATING_ID_INT: "ID của đánh giá phải là số nguyên",
    ERROR_RATING_ID_NUMBER: "ID của đánh giá phải là số",

    //section
    ERROR_SECTION_NOT_FOUND: "Không tìm thấy phần",
    ERROR_SECTION_ID_REQUIRED: "Phải nhập ID của phần",
    ERROR_SECTION_ID_NUMBER: "ID của phần phải là một số",
    ERROR_SECTION_ID_INTEGER: "ID của phần phải là số nguyên",

    //category
    ERROR_CATEGORY_ID_NUMBER: "ID của danh mục phải là số nguyên",
    ERROR_CATEGORY_ID_REQUIRED: "Phải nhập ID của danh mục",
    ERROR_CATEGORY_IMAGE_REQUIRED: "Phải nhập hình ảnh của danh mục",
    ERROR_TITLE_STRING: "Tiêu đề phải là một chuỗi",
    ERROR_TITLE_REQUIRED: "Phải nhập tiêu đề",
    ERROR_DURATION_REQUIRED: "Phải nhập thời lượng",
    ERROR_PASS_PERCENT_REQUIRED: "Phải nhập phần trăm đạt",
    ERROR_IS_TIME_LIMIT_REQUIRED: "Phải nhập tùy chọn giới hạn thời gian",
    ERROR_QUIZ_GROUP_ID_REQUIRED: "Phải nhập ID của bài kiểm tra",
    ERROR_TITLE_MAX: "Tiêu đề phải dưới 100 ký tự",
    ERROR_CATEGORY_ALREADY_EXISTS: "Danh mục đã tồn tại",

    //promotion
    ERROR_SALE_PRICE_NUMBER: "Giá bán phải là một số",
    ERROR_SALE_PRICE_REQUIRED: "Phải nhập giá bán",
    ERROR_SALE_UNTIL_MIN: "Ngày kết thúc bán phải muộn hơn hôm nay",
    ERROR_SALE_UNTIL_REQUIRED: "Phải nhập ngày kết thúc bán",
    ERROR_SALE_UNTIL_DATE: "Ngày kết thúc bán phải là một ngày",
    ERROR_SALE_MORE_EXP_THAN_PRICE: "Giá bán phải rẻ hơn giá gốc",

    ERROR_VALIDATION_FAILED: "Xác nhận thất bại",

    ERROR_GET_COURSE_FAILED: "Lấy khóa học thất bại",
    ERROR_TYPE_REQUIRED: "Phải nhập loại",

    //coupon
    ERROR_CODE_REQUIRED: "Phải nhập mã",
    ERROR_CODE_MAX: "Mã phải dưới 30 ký tự",
    ERROR_CODE_MIN: "Mã phải trên 8 ký tự",
    ERROR_DISCOUNT_MAX: "Giảm giá phải dưới 100",
    ERROR_DISCOUNT_MIN: "Giảm giá phải trên 0",
    ERROR_DISCOUNT_REQUIRED: "Phải nhập mức giảm giá",
    ERROR_REMAIN_QUANTITY_REQUIRED: "Phải nhập số lượng còn lại",
    ERROR_VALID_UNTIL_LATER_VALID_START: "Ngày hết hạn phải muộn hơn ngày bắt đầu",
    ERROR_VALID_START_EARLIER_VALID_UNTIL: "Ngày bắt đầu phải trước ngày hết hạn",
    ERROR_VALID_START_REQUIRED: "Phải nhập ngày bắt đầu",
    ERROR_VALID_UNTIL_REQUIRED: "Phải nhập ngày hết hạn",

    //event
    ERROR_NAME_REQUIRED: "Phải nhập tên",
    ERROR_NAME_MAX: "Tên phải dưới 50 ký tự",
    ERROR_DESCRIPTION_EVENT_REQUIRED: "Phải nhập mô tả",
    ERROR_DESCRIPTION_EVENT_MAX: "Mô tả phải dưới 150 ký tự",
    ERROR_DESCRIPTION_EVENT_MIN: "Mô tả phải trên 8 ký tự",
    ERROR_END_DATE_LATER_START_DATE: "Ngày kết thúc phải muộn hơn ngày bắt đầu",
    ERROR_START_DATE_EARLIER_END_DATE: "Ngày bắt đầu phải sớm hơn ngày kết thúc",
    ERROR_START_DATE_REQUIRED: "Phải nhập ngày bắt đầu",
    ERROR_END_DATE_REQUIRED: "Phải nhập ngày kết thúc",

    //
    ERROR_QUESTION_REQUIRED: "Phải nhập câu hỏi",

    //report
    ERROR_REPORT_CONTENT_REQUIRED: "Phải nhập nội dung báo cáo",
};

export default error;
