import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Imovel } from './imovel.entity';
import path, { extname } from 'path';
import * as fs from 'fs';
import { Photo } from 'src/photos/photo.entity';
import { SelectQueryBuilder } from 'typeorm';
import { FindManyOptions, Like } from 'typeorm';
import { ImovelFiltersDTO } from 'src/users/filters.dto';



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
    return this.imovelRepository.find({
      relations: ['photos'],
      order: {
        id: 'ASC', // Ordenar pelo campo 'id' em ordem crescente
      },
    });
  }
  

  async findAllWithPagination(
    page: number = 1,
    itemsPerPage: number = 10,
    filters: Partial<Imovel> = {}
  ): Promise<{ imoveis: Imovel[]; total: number }> {
    const queryBuilder: SelectQueryBuilder<Imovel> = this.imovelRepository.createQueryBuilder('imovel');
  
    if (filters) {
    
    const startIndex = (page - 1) * itemsPerPage;

    const [imoveis, total] = await queryBuilder
      .skip(startIndex)
      .take(itemsPerPage)
      .leftJoinAndSelect('imovel.photos', 'photos') 
      .getManyAndCount();

      console.log("\n\n\n\n\nqueryBuilder.skip: ",queryBuilder.skip)
      console.log("\n\n\n\n\nstartIndex: ",startIndex)
    return { imoveis, total };
  }
}


async filterImoveis(filters: ImovelFiltersDTO): Promise<Imovel[]> {
  const queryBuilder = this.imovelRepository.createQueryBuilder('imovel')
    .leftJoinAndSelect('imovel.photos', 'photos');

  if (filters) {
    const whereConditions = [];
    const parameters: Record<string, any> = {};

    // if (filters.tamanho !== undefined) {
    //   parameters.tamanho = filters.tamanho;
    //   whereConditions.push(`imovel.tamanho <= :tamanho`);
    //   console.log("\n\n\n\n\n\nTamanho: ", filters.tamanho)
    // }
    if (filters.tamanho !== undefined) {
      parameters.tamanho = filters.tamanho;
      whereConditions.push(`imovel.tamanho BETWEEN :tamanho - 50 AND :tamanho + 50`);
    }
    

    if (filters.quantidadeComodos !== undefined) {
      parameters.quantidadeComodos = filters.quantidadeComodos;
      whereConditions.push(`imovel.quantidadeComodos = :quantidadeComodos`);
    }

    if (filters.mobiliado !== undefined) {
      parameters.mobiliado = filters.mobiliado;
      whereConditions.push(`imovel.mobiliado = :mobiliado`);
    }

    // if (filters.valor !== undefined) {
    //   parameters.valor = filters.valor;
    //   whereConditions.push(`imovel.valor <= :valor`);
    // }
    if (filters.valor !== undefined) {
      parameters.valor = filters.valor;
      whereConditions.push(`imovel.valor BETWEEN :valor - 100 AND :valor + 100`);
    }
    
    
    
    
    

    if (filters.tipoImovel !== undefined) {
      parameters.tipoImovel = filters.tipoImovel;
      whereConditions.push(`imovel.tipoImovel = :tipoImovel`);
    }

    if (filters.enderecoCidade !== undefined) {
      parameters.enderecoCidade = `%${filters.enderecoCidade}%`;
      whereConditions.push(`imovel.enderecoCidade LIKE :enderecoCidade`);
    }

    if (filters.estadoNome !== undefined) {
      parameters.estadoNome = `%${filters.estadoNome}%`;
      whereConditions.push(`imovel.estadoNome LIKE :estadoNome`);
    }

    if (whereConditions.length > 0) {
      queryBuilder.andWhere(whereConditions.join(' AND '), parameters);
    }
  }

  const imoveis = await queryBuilder.getMany();
  console.log(queryBuilder)
  return imoveis;
}

async countFilteredImoveis(filters: ImovelFiltersDTO): Promise<number> {
  const queryBuilder = this.imovelRepository.createQueryBuilder('imovel');
  
  if (filters) {
    const whereConditions = [];
    const parameters: Record<string, any> = {};

    // if (filters.tamanho !== undefined) {
    //   parameters.tamanho = filters.tamanho;
    //   whereConditions.push(`imovel.tamanho <= :tamanho`);
    // }
    if (filters.tamanho !== undefined) {
      parameters.tamanho = filters.tamanho;
      whereConditions.push(`imovel.tamanho BETWEEN :tamanho - 50 AND :tamanho + 50`);
    }

    if (filters.quantidadeComodos !== undefined) {
      parameters.quantidadeComodos = filters.quantidadeComodos;
      whereConditions.push(`imovel.quantidadeComodos = :quantidadeComodos`);
    }

    if (filters.mobiliado !== undefined) {
      parameters.mobiliado = filters.mobiliado;
      whereConditions.push(`imovel.mobiliado = :mobiliado`);
    }

    // if (filters.valor !== undefined) {
    //   parameters.valor = filters.valor;
    //   whereConditions.push(`imovel.valor <= :valor`);
    // }
    if (filters.valor !== undefined) {
      parameters.valor = filters.valor;
      whereConditions.push(`imovel.valor BETWEEN :valor - 100 AND :valor + 100`);
    }
    
    
    
    
    

    if (filters.tipoImovel !== undefined) {
      parameters.tipoImovel = filters.tipoImovel;
      whereConditions.push(`imovel.tipoImovel = :tipoImovel`);
    }

    if (filters.enderecoCidade !== undefined) {
      parameters.enderecoCidade = `%${filters.enderecoCidade}%`;
      whereConditions.push(`imovel.enderecoCidade LIKE :enderecoCidade`);
    }

    if (filters.estadoNome !== undefined) {
      parameters.estadoNome = `%${filters.estadoNome}%`;
      whereConditions.push(`imovel.estadoNome LIKE :estadoNome`);
    }

    if (whereConditions.length > 0) {
      queryBuilder.andWhere(whereConditions.join(' AND '), parameters);
    }
  }

  const totalImoveis = await queryBuilder.getCount();
  console.log("\n\n\n\n\n\nNúmero de imóveis: ", totalImoveis)
  return totalImoveis;
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
      relations: ['photos'],
      order: {
        id: 'ASC', // Ordenar pelo campo 'id' em ordem crescente
      },
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