import { Test, TestingModule } from '@nestjs/testing';
import { TaskManagmentController } from './task-managment.controller';
import { TaskManagmentService } from './task-managment.service';


describe('TaskManagmentController', () => {
  let controller: TaskManagmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskManagmentController],
      providers: [TaskManagmentService],
    }).compile();

    controller = module.get<TaskManagmentController>(TaskManagmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
