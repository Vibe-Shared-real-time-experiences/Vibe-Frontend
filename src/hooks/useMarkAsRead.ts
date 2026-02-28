// import { useEffect, useRef, useState } from 'react';
// import { debounce } from 'lodash'; // Hoặc tự viết hàm debounce

// export const useMarkAsRead = (
//     channelId: string,
//     currentLastReadId: string, // ID server trả về lúc init
//     messages: Channelmessages[]
// ) => {
//     // Biến này để track ID mới nhất user đã nhìn thấy (Local state)
//     const [optimisticReadId, setOptimisticReadId] = useState(currentLastReadId);

//     // Dùng ref để giữ hàm debounce không bị tạo lại mỗi lần render
//     const debouncedApiCall = useRef(
//         debounce((channelId: string, messageId: string) => {
//             console.log(`📡 Call API: Mark channel ${channelId} read at msg ${messageId}`);
//             api.post(`/channels/${channelId}/read`, { messageId });
//         }, 1000) // Chỉ gọi API sau khi dừng scroll 1 giây
//     ).current;

//     useEffect(() => {
//         // Logic Intersection Observer
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 entries.forEach((entry) => {
//                     if (entry.isIntersecting) {
//                         const visibleMsgId = entry.target.getAttribute('data-msg-id');

//                         if (visibleMsgId && BigInt(visibleMsgId) > BigInt(optimisticReadId)) {
//                             // 1. Update UI ngay lập tức (Xóa badge đỏ, làm mờ tin nhắn chưa đọc)
//                             setOptimisticReadId(visibleMsgId);

//                             // 2. Queue việc gọi API (Server sẽ được update sau 1s)
//                             debouncedApiCall(channelId, visibleMsgId);
//                         }
//                     }
//                 });
//             },
//             { threshold: 0.5 } // Tin nhắn hiện ra 50% là tính đã xem
//         );

//         // Chỉ observe 5 tin nhắn cuối cùng để tối ưu performance
//         const messageElements = document.querySelectorAll('.message-item');
//         const lastFewMessages = Array.from(messageElements).slice(-5);

//         lastFewMessages.forEach(el => observer.observe(el));

//         return () => observer.disconnect();
//     }, [messages, channelId, optimisticReadId]);

//     return optimisticReadId; // Trả về để UI render cái vạch "New Messages"
// };