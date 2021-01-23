import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './tasks-status.enum';
import { TasksService } from './tasks.service';

const mockUser = { id: 12, username: 'Test user' };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('get all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search query',
      };

      const result = await tasksService.getTasks(filters, mockUser);

      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });

    describe('get task by id', () => {
      it('calls taskRepository.findOne() and succesfully retrieve and return task', async () => {
        const mockTask = {
          title: 'Test task',
          description: 'Test desc',
        };

        taskRepository.findOne.mockResolvedValue(mockTask);

        const result = await tasksService.getTaskById(1, mockUser);
        expect(result).toEqual(mockTask);

        expect(taskRepository.findOne).toHaveBeenCalledWith({
          where: { id: 1, userId: mockUser.id },
        });
      });

      it('throws an error as task is not found', () => {
        taskRepository.findOne.mockResolvedValue(null);
        expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('createTask', () => {
      it('calls taskRepository.create() and returns the result', async () => {
        taskRepository.createTask.mockResolvedValue('someTask');
        expect(taskRepository.createTask).not.toHaveBeenCalled();

        const creatTaskDto = { title: 'Test task', description: 'Task desc' };

        const result = await tasksService.createTask(creatTaskDto, mockUser);
        expect(taskRepository.createTask).toHaveBeenCalledWith(
          creatTaskDto,
          mockUser,
        );
        expect(result).toEqual('someTask');
      });
    });

    describe('deleteTask', () => {
      it('call taskRepository.deleteTask() to delete a task', async () => {
        taskRepository.delete.mockResolvedValue({ affected: 1 });
        expect(taskRepository.delete).not.toHaveBeenCalled();
        await tasksService.delete(1, mockUser);
        expect(taskRepository.delete).toHaveBeenCalledWith({
          id: 1,
          userId: mockUser.id,
        });
      });

      it('throws an error as task could not be found', () => {
        taskRepository.delete.mockResolvedValue({ affected: 0 });
        expect(tasksService.delete(1, mockUser)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('updateTaskStatus', () => {
      it('update a task status', async () => {
        const save = jest.fn().mockResolvedValue(true);

        tasksService.getTaskById = jest.fn().mockResolvedValue({
          status: TaskStatus.OPEN,
          save,
        });
        expect(save).not.toHaveBeenCalled();
        expect(tasksService.getTaskById).not.toHaveBeenCalled();
        const result = await tasksService.updateTaskStatus(
          1,
          TaskStatus.DONE,
          mockUser,
        );

        expect(tasksService.getTaskById).toHaveBeenCalled();
        expect(save).toHaveBeenCalled();
        expect(result.status).toEqual(TaskStatus.DONE);
      });
    });
  });
});
