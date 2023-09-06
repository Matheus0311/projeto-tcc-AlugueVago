// filters.dto.ts

import { IsNumber, IsBoolean, IsString } from 'class-validator';

export class ImovelFiltersDTO {
  @IsNumber()
  tamanho?: number;

  @IsNumber()
  quantidadeComodos?: number;

  @IsBoolean()
  mobiliado?: boolean;

  @IsNumber()
  valor?: number;

  @IsString()
  tipoImovel?: string;

  @IsString() 
  enderecoCidade?: string;

  @IsString() 
  estadoNome?: string;

  @IsNumber()  
  page?: number;
}
