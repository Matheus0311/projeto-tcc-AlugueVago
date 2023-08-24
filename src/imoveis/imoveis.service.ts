import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Imovel } from './imovel.entity';
import { Endereco } from '../enderecos/endereco.entity';
import path, { extname } from 'path';
import * as fs from 'fs';
import { Photo } from 'src/photos/photo.entity';

@Injectable()
export class ImovelService {
  constructor(
    @InjectRepository(Imovel)
    private readonly imovelRepository: Repository<Imovel>,
  ) {}

  async saveFile(file: Express.Multer.File, destination: string): Promise<string> {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filePath = `${destination}/${uniqueSuffix}${extname(file.originalname)}`;
    
    await fs.promises.writeFile(filePath, file.buffer);
    return filePath;
  }

  async createImovelWithFiles(imovel: Imovel, photos: Photo[], pdfDocument: Express.Multer.File): Promise<Imovel> {
    console.log("Entrou no createImovelWithFiles")
    return this.imovelRepository.manager.transaction(async transactionalEntityManager => {

      if (photos && photos.length > 0) {
        imovel.photos = photos;
        console.log(photos)
      }

      const savedImovel = await transactionalEntityManager.save(Imovel, imovel);
      console.log("Imóvel Salvo!!!")
      return savedImovel;
    });
  }


  
  
  async findAll(): Promise<Imovel[]> {
    return this.imovelRepository.find();
  }

  async findOne(id: number): Promise<Imovel> {
    return this.imovelRepository.findOne({ where: { id }, relations: ['usuario', 'photos'] });
  }

  async findById(id: number): Promise<Imovel | undefined> {
    return await this.imovelRepository.findOne({ where: { id }, relations: ['photos'] });
  }
  

  async findImoveisByUserId(userId: number): Promise<Imovel[]> {
    console.log("entrou aqui no findImoveisByUserId");
  
    const userImoveis = await this.imovelRepository.find({
      where: { usuario: { id: userId } },
      relations: ['photos'] 
    });
  
    console.log("userImoveis:", userImoveis); 
  
    return userImoveis;
  }
  
  async deletePhotosByImovelId(imovelId: number): Promise<void> {
    const imovel = await this.findById(imovelId);
    if (imovel) {
      imovel.photos = [];
      await this.imovelRepository.save(imovel);
    }
  }


  async update(id: number, imovel: Imovel): Promise<Imovel> {
    await this.imovelRepository.save(imovel); 
    return this.imovelRepository.findOne({ where: { id } });
  }
  

  async updatePhotos(imovel: Imovel): Promise<void> {
    await this.imovelRepository.save(imovel);
  }
  

  async delete(id: number): Promise<void> {
    await this.imovelRepository.delete(id);
  }
}