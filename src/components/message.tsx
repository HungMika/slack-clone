import { Doc, Id } from "../../convex/_generated/dataModel";
interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage: string;
  isAuthor: boolean; // Kiểm tra xem có phải tác giả hay không
  reactions: Array<Omit<Doc<"reactions">, "memberId">>; // Phản ứng với tin nhắn (ví dụ: like, love, etc.)
  body: string; // Nội dung của tin nhắn
  image?: string; // Ảnh trong tin nhắn (nếu có)
  updatedAt: Date; // Thời gian cập nhật cuối cùng
  createdAt: Date; // Thời gian tạo
  isEditing: boolean; // Kiểm tra xem tin nhắn có đang được chỉnh sửa không
  setEditingId: (id: string | null) => void; // Hàm để thiết lập ID của tin nhắn đang chỉnh sửa
  isCompat: boolean; // Kiểm tra tính tương thích (nếu cần thiết)
  hideThread: boolean; // Ẩn thread của tin nhắn
  hideThreadButton: boolean; // Ẩn nút mở thread
  threadCount?: number; // Số lượng thread (nếu có)
  threadImage?: string; // Ảnh liên quan đến thread (nếu có)
  threadTimestamp?: Date;
}
