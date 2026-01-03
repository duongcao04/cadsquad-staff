export const transformEmail = (
    value: string,
    suffix: string = '@cadsquad.vn'
) => {
    if (!value) return ''

    const email = value.trim().toLowerCase()

    // 1. Nếu đã đúng định dạng @cadsquad.vn thì trả về luôn
    if (email.endsWith(suffix)) {
        return email
    }

    // 2. Nếu có ký tự @ nhưng sai domain (ví dụ: abc@gmail.com)
    // Lấy phần trước dấu @ đầu tiên và nối với suffix chuẩn
    if (email.includes('@')) {
        return email.split('@')[0] + suffix
    }

    // 3. Nếu không có ký tự @ (chỉ là prefix: abc)
    return email + suffix
}
