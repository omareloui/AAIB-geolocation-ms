import { Test, TestingModule } from '@nestjs/testing';
import { FilterService } from './filter.service';

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilterService],
    }).compile();

    service = module.get<FilterService>(FilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should accept "language" and "lang" for language (prioritizes "language")', () => {
    expect(service.parseOptions({ language: 'en' }).language).toEqual('en');
    expect(service.parseOptions({ lang: 'ar' }).language).toEqual('ar');
    expect(
      service.parseOptions({ language: 'ar', lang: 'en' }).language,
    ).toEqual('ar');
  });
});
