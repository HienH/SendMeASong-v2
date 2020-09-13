import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentPlaylistComponent } from './sent-playlist.component';

describe('SentPlaylistComponent', () => {
  let component: SentPlaylistComponent;
  let fixture: ComponentFixture<SentPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
