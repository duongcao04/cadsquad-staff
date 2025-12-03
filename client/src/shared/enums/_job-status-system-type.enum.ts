export enum JobStatusSystemTypeEnum {
	STANDARD = 'STANDARD', // Trạng thái bình thường (To do, In Progress...)
	COMPLETED = 'COMPLETED', // Đã làm xong việc (nhưng chưa đóng hồ sơ)
	TERMINATED = 'TERMINATED' // Kết thúc vòng đời (Finished, Cancelled, Closed...)
}