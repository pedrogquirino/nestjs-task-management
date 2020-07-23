import { PipeTransform, BadRequestException } from "@nestjs/common";
import { realpath } from "fs";
import { TaskStatus } from "../tasks-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {

    readonly allowStatuses = [
        TaskStatus.DONE,
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS
    ]

    transform(value: any) {
        
        value = value.toUpperCase();    

        if(!this.isStatusValid(value)){
            throw new BadRequestException(`"${value}" is an invalid status`);
        }
        
        return value;
    }

    private isStatusValid(status: any) {
        const idx = this.allowStatuses.indexOf(status);
        return idx !== -1;
    }
    
}