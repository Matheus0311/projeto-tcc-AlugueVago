import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PhotosService } from './photos.service';

describe('Photo Entity', () => {
  let photoService: PhotosService;
  let photoRepository: Repository<Photo>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        {
          provide: getRepositoryToken(Photo),
          useClass: Repository,
        },
      ],
    }).compile();

    photoService = module.get<PhotosService>(PhotosService);
    photoRepository = module.get<Repository<Photo>>(getRepositoryToken(Photo));
  });

  it('should be defined', () => {
    expect(photoService).toBeDefined();
  });

  it('should create a photo', async () => {
    const mockPhoto: Photo = {
      id: 1,
      url: 'test-url',
      imovel: null, 
    };

    const createPhotoSpy = jest
      .spyOn(photoService, 'createPhoto')
      .mockResolvedValue(mockPhoto);

    const createdPhoto = await photoService.createPhoto(mockPhoto);

    expect(createdPhoto).toEqual(mockPhoto);
    expect(createPhotoSpy).toHaveBeenCalledWith(mockPhoto);
  });

  it('should delete photos by imovel ID', async () => {
    const imovelId = 1;

    const deletePhotosByImovelIdSpy = jest
      .spyOn(photoService, 'deletePhotosByImovelId')
      .mockResolvedValue(undefined);

    await photoService.deletePhotosByImovelId(imovelId);

    expect(deletePhotosByImovelIdSpy).toHaveBeenCalledWith(imovelId);
  });

  it('should find all photos', async () => {
    const mockPhotos: Photo[] = [
      {
        id: 1,
        url: 'test-url-1',
        imovel: null, 
      },
      {
        id: 2,
        url: 'test-url-2',
        imovel: null, 
      },
    ];

    const findAllPhotosSpy = jest
      .spyOn(photoService, 'findAll')
      .mockResolvedValue(mockPhotos);

    const photos = await photoService.findAll();

    expect(photos).toEqual(mockPhotos);
    expect(findAllPhotosSpy).toHaveBeenCalled();
  });

});
