import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmusuariosComponent } from './admusuarios.component';

describe('AdmusuariosComponent', () => {
  let component: AdmusuariosComponent;
  let fixture: ComponentFixture<AdmusuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmusuariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmusuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
