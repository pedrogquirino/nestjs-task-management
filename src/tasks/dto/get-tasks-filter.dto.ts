import { IsOptional, IsIn, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../tasks-status.enum";

export class GetTasksFilterDto {
    
    @IsOptional()
    @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
    status: TaskStatus;
    
    @IsOptional()
    @IsNotEmpty()
    search: string;
}