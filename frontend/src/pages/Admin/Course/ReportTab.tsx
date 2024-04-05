const ReportTab = () => {
    return (
        <div className="w-full border min-h-[600px] shadow-md">
            <div className="border-b border-gray">
                <p className="text-2xl font-normal p-6">Báo cáo khoá học</p>
            </div>
            <div className="p-6 pr-24 border-b border-gray">
                <p className="mt-2 mb-4">
                    Đây sẽ là trang mà bạn có thể dùng để gửi các yêu cầu xét duyệt khoá học tới người quản trị, cũng
                    như theo dõi tình trạng khoá học hiện tại theo quyết định của người quản trị
                </p>
                <div className="mt-2 mb-4">
                    <p className="font-bold">Gửi yêu cầu xét duyệt khoá học</p>
                    <p className="my-1">
                        Sau khi chuẩn bị nội dung khoá học kĩ càng, bạn có thể gửi yêu cầu được phê duyệt và hiển thị
                        khoá học ở đây
                    </p>
                </div>
                <div className="mt-2 mb-4">
                    <p className="font-bold mb-2">Các quyết định trên khoá học của bạn</p>
                </div>
            </div>
            <div className="p-6">
                <p className="text-2xl font-normal">Xoá khoá học</p>
                <p className="font-normal">
                    Bạn có thể xoá khoá học tại đây.{" "}
                    <span className="text-red-600">Lưu ý đây là hành động không thể hoàn tác</span>
                </p>
            </div>
        </div>
    );
};
export default ReportTab;
