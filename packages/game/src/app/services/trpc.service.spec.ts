import { TestBed } from '@angular/core/testing';

import { TrpcService } from './trpc.service';

describe('TrpcServiceService', () => {
  let service: TrpcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrpcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
