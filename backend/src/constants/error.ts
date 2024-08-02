const error = {
    //etc
    ERROR_COUPON_USED: "Mã giảm giá đã được sử dụng",
    ERROR_INTERNAL_SERVER: "Lỗi máy chủ nội bộ",
    ERROR_BAD_REQUEST: "Yêu cầu không hợp lệ",
    ERROR_UNAUTHORIZED: "Không có quyền truy cập",
    ERROR_MISSING_REQUEST_BODY: "Thiếu nội dung yêu cầu",
    ERROR_DATA_NOT_FOUND: "Dữ liệu không được tìm thấy",
    ERROR_LOGIN_AGAIN: "Vui lòng đăng nhập lại",
    ERROR_VALIDATION_FAILED: "Xác thực không thành công",
    //confirm password
    ERROR_CONFIRM_PASSWORD: "Xác nhận mật khẩu và mật khẩu phải giống nhau",
    ERROR_CONFIRM_NEW_PASSWORD: "Xác nhận mật khẩu và mật khẩu mới phải giống nhau",
    ERROR_CONFIRM_PASSWORD_REQUIRED: "Phải nhập xác nhận mật khẩu",
    //email
    ERROR_EMAIL_USED: "Email đã được sử dụng",
    ERROR_ALREADY_VERIFY: "Email đã được xác minh",
    ERROR_EMAIL_STRING: "Email phải là chuỗi ký tự",
    ERROR_EMAIL_REQUIRED: "Phải nhập email",
    ERROR_EMAIL_FORMAT: "Định dạng email không đúng, Ví dụ: example@gmail.com",
    ERROR_EMAIL_MAX: "Email phải dưới 50 ký tự",
    //password
    ERROR_PASSWORD_STRING: "Mật khẩu phải là chuỗi ký tự",
    ERROR_PASSWORD_REQUIRED: "Phải nhập mật khẩu",
    ERROR_PASSWORD_MAX: "Mật khẩu phải dưới 20 ký tự",
    ERROR_PASSWORD_MIN: "Mật khẩu phải nhiều hơn 20 ký tự",
    ERROR_WRONG_PASSWORD: "Mật khẩu không đúng",
    // current password
    ERROR_CURRENT_PASSWORD_STRING: "Mật khẩu hiện tại phải là chuỗi ký tự",
    ERROR_CURRENT_PASSWORD_REQUIRED: "Phải nhập mật khẩu hiện tại",
    ERROR_CURRENT_PASSWORD_MAX: "Mật khẩu hiện tại phải dưới 20 ký tự",
    ERROR_CURRENT_PASSWORD_MIN: "Mật khẩu hiện tại phải nhiều hơn 20 ký tự",
    ERROR_WRONG_CURRENT_PASSWORD: "Mật khẩu hiện tại không đúng",
    //new password
    ERROR_NEW_PASSWORD_STRING: "Mật khẩu mới phải là chuỗi ký tự",
    ERROR_NEW_PASSWORD_REQUIRED: "Phải nhập mật khẩu mới",
    ERROR_NEW_PASSWORD_MAX: "Mật khẩu mới phải dưới 20 ký tự",
    ERROR_NEW_PASSWORD_MIN: "Mật khẩu mới phải nhiều hơn 20 ký tự",
    //token
    ERROR_BAD_TOKEN: "Token không hợp lệ",
    ERROR_TOKEN_STRING: "Token phải là chuỗi ký tự",
    ERROR_TOKEN_REQUIRED: "Token là BẮT BUỘC",
    //first name
    ERROR_FIRST_NAME_STRING: "Tên phải là chuỗi ký tự",
    ERROR_FIRST_NAME_REQUIRED: "Phải nhập tên",
    ERROR_FIRST_NAME_MAX: "Tên phải dưới 30 ký tự",
    //last name
    ERROR_LAST_NAME_STRING: "Họ phải là chuỗi ký tự",
    ERROR_LAST_NAME_REQUIRED: "Phải nhập họ",
    ERROR_LAST_NAME_MAX: "Họ phải dưới 30 ký tự",
    //user
    ERROR_USER_NOT_FOUND: "Sai email hoặc người dùng không tồn tại",
    //category
    ERROR_CATEGORY_NOT_FOUND: "Danh mục không tồn tại",
    //lesson
    ERROR_LESSON_NOT_FOUND: "Bài học không tồn tại",

    //description
    ERROR_DESCRIPTION_STRING: "Mô tả phải là chuỗi ký tự",
    ERROR_DESCRIPTION_REQUIRED: "Phải nhập mô tả",
    ERROR_DESCRIPTION_TOO_MAX: "Mô tả quá dài",
    ERROR_DESCRIPTION_TOO_SHORT: "Mô tả quá ngắn",

    // lecture
    ERROR_LECTURE_TYPE_REQUIRED: "Phải nhập loại",
    ERROR_LECTURE_TYPE_STRING: "Loại phải là chuỗi ký tự",
    ERROR_LECTURE_TYPE_TOO_LONG: "Loại quá dài",
    ERROR_LECTURE_DURATION_REQUIRED: "Phải nhập thời lượng",
    ERROR_LECTURE_DURATION_NUMBER: "Thời lượng phải là số",
    ERROR_LECTURE_DURATION_POSITIVE: "Thời lượng phải là số dương",
    ERROR_LECTURE_PASS_PERCENT_POSITIVE: "Tỷ lệ đậu phải là số dương",
    ERROR_LECTURE_TIME_LIMIT_BOOLEAN: "Giới hạn thời gian phải là kiểu boolean",
    ERROR_QUIZ_GROUP_ID: "ID nhóm câu đố phải là số",
    ERROR_QUIZ_GROUP_ID_INT: "ID nhóm câu đố phải là số nguyên",
    ERROR_LECTURE_NOT_FOUND: "Bài giảng không tồn tại",
    ERROR_LECTURE_ID_REQUIRED: "Phải nhập ID bài giảng",
    ERROR_LECTURE_ID_NUMBER: "ID bài giảng phải là số",
    ERROR_LECTURE_ID_INTEGER: "ID bài giảng phải là số nguyên",

    //course
    ERROR_COURSE_NOT_FOUND: "Khóa học không tồn tại",
    ERROR_COURSE_TITLE_REQUIRED: "Phải nhập tiêu đề khóa học",
    ERROR_COURSE_TITLE_STRING: "Tiêu đề khóa học phải là chuỗi ký tự",
    ERROR_COURSE_TITLE_TOO_LONG: "Tiêu đề khóa học quá dài",
    ERROR_COURSE_ID_REQUIRED: "Phải nhập ID khóa học",
    ERROR_COURSE_ID_NUMBER: "ID khóa học phải là số",
    ERROR_COURSE_ID_INTEGER: "ID khóa học phải là số nguyên",
    ERROR_COURSE_SLUG_REQUIRED: "Phải nhập slug của khóa học",
    ERROR_COURSE_SLUG_STRING: "Slug của khóa học phải là chuỗi ký tự",
    ERROR_COURSE_SLUG_MALFORMED: "Slug của khóa học không đúng định dạng",
    ERROR_COURSE_STATUS_REQUIRED: "Phải nhập trạng thái của khóa học",
    ERROR_COURSE_STATUS_BOOLEAN: "Trạng thái của khóa học phải là kiểu boolean",
    ERROR_COURSE_DESCRIPTION_REQUIRED: "Phải nhập mô tả của khóa học",
    ERROR_COURSE_DESCRIPTION_STRING: "Mô tả của khóa học phải là chuỗi ký tự",
    ERROR_COURSE_SUMMARY_REQUIRED: "Phải nhập tóm tắt của khóa học",
    ERROR_COURSE_SUMMARY_STRING: "Tóm tắt của khóa học phải là chuỗi ký tự",
    ERROR_COURSE_CATEGORIES_REQUIRED: "Phải nhập danh mục của khóa học",
    ERROR_COURSE_THUMBNAIL_REQUIRED: "Phải nhập hình thu nhỏ của khóa học",
    ERROR_COURSE_PRICE_REQUIRED: "Phải nhập giá khóa học",
    ERROR_COURSE_PRICE_NUMBER: "Giá khóa học phải là số",
    ERROR_COURSE_PRICE_POSITIVE: "Giá khóa học phải là số dương",
    ERROR_CREATE_COURSE_FAILED: "Tạo khóa học thất bại",
    ERROR_GET_COURSE_FAILED: "Lấy khóa học thất bại",

    //rating
    ERROR_RATING_NOT_FOUND: "Đánh giá không tồn tại",
    ERROR_ALREADY_RATING: "Bạn đã đánh giá khóa học này rồi",
    ERROR_RATING_SCORE_REQUIRED: "Phải nhập điểm đánh giá",
    ERROR_RATING_SCORE_MAX: "Điểm đánh giá phải nhỏ hơn 5",
    ERROR_RATING_SCORE_MIN: "Điểm đánh giá phải lớn hơn 0",
    ERROR_RATING_SCORE_INT: "Điểm đánh giá phải là số nguyên",
    ERROR_RATING_CONTENT_MAX: "Nội dung phải dưới 300 ký tự",
    ERROR_RATING_CONTENT_STRING: "Nội dung phải là chuỗi ký tự",
    ERROR_RATING_ID_REQUIRED: "Phải nhập ID đánh giá",
    ERROR_RATING_ID_INT: "ID đánh giá phải là số nguyên",
    ERROR_RATING_ID_NUMBER: "ID đánh giá phải là số",

    //section
    ERROR_SECTION_NOT_FOUND: "Phần không tồn tại",
    ERROR_SECTION_ID_REQUIRED: "Phải nhập ID phần",
    ERROR_SECTION_ID_NUMBER: "ID phần phải là số",
    ERROR_SECTION_ID_INTEGER: "ID phần phải là số nguyên",

    //category
    ERROR_CATEGORY_ID_NUMBER: "ID danh mục phải là số nguyên",
    ERROR_CATEGORY_ID_REQUIRED: "Phải nhập ID danh mục",
    ERROR_TITLE_STRING: "Tiêu đề phải là chuỗi ký tự",
    ERROR_TITLE_REQUIRED: "Phải nhập tiêu đề",
    ERROR_TITLE_MAX: "Tiêu đề phải dưới 50 ký tự",
    ERROR_CATEGORY_ALREADY_EXISTS: "Danh mục đã tồn tại",

    //promotion
    ERROR_SALE_PRICE_NUMBER: "Giá giảm phải là số",
    ERROR_SALE_PRICE_REQUIRED: "Phải nhập giá giảm",
    ERROR_SALE_UNTIL_MIN: "Ngày hết hạn phải muộn hơn hôm nay",
    ERROR_SALE_UNTIL_REQUIRED: "Phải nhập ngày hết hạn",
    ERROR_SALE_UNTIL_DATE: "Ngày hết hạn phải là ngày",
    ERROR_SALE_MORE_EXP_THAN_PRICE: "Giá giảm phải rẻ hơn giá gốc",

    //cart
    ERROR_ALREADY_IN_CART: "Khóa học đã có trong giỏ hàng",
    ERROR_ALREADY_ENROLLED: "Khóa học đã được ghi danh",
    ERROR_COURSE_NOT_FOUND_IN_CART: "Không tìm thấy khóa học trong giỏ hàng",
    ERROR_CART_NOT_FOUND: "Không tìm thấy giỏ hàng",

    //Invoice
    ERROR_INVOICE_NOT_FOUND: "Không tìm thấy hóa đơn",

    //Event
    ERROR_EVENT_NOT_FOUND: "Sự kiện đã kết thúc hoặc không tìm thấy",
    ERROR_EVENT_IN_BETWEEN: "Có sự kiện khác trong khoảng thời gian này",
    ERROR_EXIST_ACTIVE_EVENT: "Đã có sự kiện hoạt động trước đó, không thể tạo sự kiện khác",

    // History Spin
    ERROR_HISTORY_SPIN_NOT_FOUND: "Người dùng này chưa có lịch sử quay cho sự kiện này",

    //Comment
    ERROR_COMMENT_NOT_FOUND: "Không tìm thấy bình luận",
    //Reply
    ERROR_REPLY_NOT_FOUND: "Không tìm thấy trả lời",
    //Like
    ERROR_LIKE_ONCE_TIME: "Bạn chỉ có thể thích một lần",
    ERROR_LIKE_NOT_FOUND: "Không tìm thấy phản hồi thích",
    // Dislike
    ERROR_DISLIKE_ONCE_TIME: "Bạn chỉ có thể không thích một lần",
    ERROR_DISLIKE_NOT_FOUND: "Không tìm thấy phản hồi không thích",

    // Coupon
    ERROR_COUPON_NOT_FOUND: "Không tìm thấy mã giảm giá cho sự kiện",

    //blog
    ERROR_BLOG_NOT_FOUND: "Không tìm thấy bài viết",
    ERROR_BLOG_TITLE_REQUIRED: "Phải nhập tiêu đề bài viết",
    ERROR_BLOG_TITLE_STRING: "Tiêu đề bài viết phải là chuỗi ký tự",
    ERROR_BLOG_TITLE_TOO_LONG: "Tiêu đề bài viết quá dài",
    ERROR_BLOG_CONTENT_REQUIRED: "Phải nhập nội dung bài viết",
    ERROR_BLOG_CONTENT_STRING: "Nội dung bài viết phải là chuỗi ký tự",
    ERROR_CREATE_BLOG_FAILED: "Tạo bài viết thất bại",
    ERROR_GET_BLOG_FAILED: "Lấy bài viết thất bại",
    ERROR_BLOG_ALREADY_EXISTS: "Tiêu đề bài viết đã tồn tại",

    ERROR_BLOG_SLUG_REQUIRED: "Phải nhập slug của bài viết",
    ERROR_BLOG_SLUG_STRING: "Slug của bài viết phải là chuỗi ký tự",
    ERROR_BLOG_SLUG_MALFORMED: "Slug của bài viết không đúng định dạng",

    ERROR_BLOG_ID_NUMBER: "ID bài viết phải là số nguyên",
    ERROR_BLOG_ID_REQUIRED: "Phải nhập ID bài viết",
    ERROR_TITLE_BLOG_STRING: "Tiêu đề phải là chuỗi ký tự",
    ERROR_TITLE_BLOG_REQUIRED: "Phải nhập tiêu đề",
    ERROR_TITLE_BLOG_MAX: "Tiêu đề phải dưới 50 ký tự",
    ERROR_CONTENT_BLOG_STRING: "Nội dung phải là chuỗi ký tự",
    ERROR_CONTENT_BLOG_REQUIRED: "Phải nhập nội dung",
    ERROR_CONTENT_BLOG_MAX: "Nội dung phải dưới 1000 ký tự",
    ERROR_CONTENT_BLOG_SHORT: "Nội dung phải ít nhất 100 ký tự",
    ERROR_BLOG_CATEGORIES_REQUIRED: "Phải nhập danh mục của bài viết",
    ERROR_IS_PUBLISHED_BOOLEAN: "Trạng thái xuất bản phải là kiểu boolean",

    // comment blog
    ERROR_DUPLICATE_BETWEEN_COMMENTBLOGID_REPLYBLOGID: "Trùng lặp giữa ID bình luận và ID cha",
    ERROR_COMMENT_BLOG_NOT_FOUND: "Không tìm thấy bình luận cho bài viết",
    ERROR_REACTION_ONCE_TIME: "Phản hồi chỉ một lần",
};

export default error;
