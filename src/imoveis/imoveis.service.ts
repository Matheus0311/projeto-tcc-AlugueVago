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

  // async createImovel(imovel: Imovel): Promise<Imovel> {
  //   console.log("entrou no createImovel")
  //   return this.imovelRepository.manager.transaction(async transactionalEntityManager => {
  //     const savedImovel = await transactionalEntityManager.save(Imovel, imovel);
  //     return savedImovel;
  //   });
  // }

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
        console.log("Tem fotos!!!!\n\n")
        // Salvar as fotos no banco
        for (const photoData of photos) {
          console.log("Salvando foto por foto")
          const newPhoto = new Photo(); // Crie uma nova instância da foto
          newPhoto.url = photoData.url;
          newPhoto.imovel = imovel; // Associe a nova foto ao imóvel
          await transactionalEntityManager.save(newPhoto);
          console.log("Foto Salva!!!!")
        }

        // Associar as fotos ao imóvel
        imovel.photos = photos;
      }
  
      if (pdfDocument) {
        console.log("Tem documentos!!!")
        const pdfPath = await this.saveFile(pdfDocument, './uploads/documentos-imoveis');
        imovel.pdfDocument = pdfPath;
      }
  
      // Salvar o imóvel atualizado no banco
      console.log("Quase salvando...")
      const savedImovel = await transactionalEntityManager.save(Imovel, imovel);
      console.log("Imóvel Salvo!!!")
      return savedImovel;
    });
  }
  
  

  

  async findAll(): Promise<Imovel[]> {
    return this.imovelRepository.find();
  }

  async findOne(id: number): Promise<Imovel> {
    return this.imovelRepository.findOne({ where: { id }, relations: ['usuario'] });
  }

  async findImoveisByUserId(userId: number): Promise<Imovel[]> {
    console.log("entrou aqui");
    return this.imovelRepository.find({ where: { usuario: { id: userId } } });
  }

  async update(id: number, imovel: Imovel): Promise<Imovel> {
    await this.imovelRepository.update(id, imovel);
    return this.imovelRepository.findOne({ where: { id } });
  }
  

  async delete(id: number): Promise<void> {
    await this.imovelRepository.delete(id);
  }
}