import { Test, TestingModule } from '@nestjs/testing';
import { TaskManagmentService } from './task-managment.service';

describe('TaskManagmentService', () => {
  let service: TaskManagmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskManagmentService],
    }).compile();

    service = module.get<TaskManagmentService>(TaskManagmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
