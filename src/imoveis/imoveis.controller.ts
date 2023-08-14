import { Controller, Post, Body, Get, Param, Put, Delete, InternalServerErrorException, Render, UseGuards, BadRequestException, Req, UseInterceptors, UploadedFile, Res, Request, ConsoleLogger, ParseIntPipe  } from '@nestjs/common';
import { ImovelService } from './imoveis.service';
import { Imovel } from './imovel.entity';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { User } from 'src/users/user.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from 'src/users/users.service';
import * as fs from 'fs';
import { useBeforeUnload } from 'react-router-dom';
export interface ExtendedUser extends User {
  userImoveis: Imovel[];
}
import { NotFoundException } from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';



@Controller('imoveis')
export class ImovelController {
  constructor(private readonly imovelService: ImovelService, private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('pdfDocument', {
    storage: diskStorage({
      destination: './uploads/documentos-imoveis',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }),
  // FilesInterceptor('fotos', 6, {
  //   storage: diskStorage({
  //     destination: (req, file, callback) => {
  //       // const user: User = req.user as User; 
  //       // console.log(user.id);
  //       const uniqueToken = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
  //       const folder = `./uploads/fotos-imoveis/${uniqueToken}`;
  //       if (!fs.existsSync(folder)) {
  //         fs.mkdirSync(folder, { recursive: true });
  //       }
  //       callback(null, folder);
  //     },
  //     filename: (req, file, callback) => {
  //       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  //       callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
  //     },
  //   }),
  // })
  FileInterceptor('fotos', {
    storage: diskStorage({
      destination: './uploads/fotos-imoveis',
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileExtension = file.originalname.split('.').pop(); // Obter a extensão do arquivo
        const filename = `${uniqueSuffix}.${fileExtension}`; // Nome do arquivo com base em um valor único
        cb(null, filename);
      },
    }),
  }),
  )
  async create(
    @Body() body: any,
    @UploadedFile() pdfDocument: Express.Multer.File,
    @UploadedFile() fotos: Express.Multer.File[],
    @Req() req,
  ): Promise<Imovel> {
    const {
      tamanho,
      quantidadeComodos,
      mobiliado,
      statusNegociacao,
      valor,
      descricao,
      numeroInscricao,
      rgProprietario,
      cpfProprietario,
      telefoneContato,
      emailContato,
      enderecoRua,
      enderecoNumero,
      enderecoBairro,
      enderecoCEP,
      enderecoCidade,
      estadoNome,
    } = body;
    console.log(body)

    if (
      !enderecoRua ||
      !enderecoNumero ||
      !enderecoBairro ||
      !enderecoCEP ||
      !enderecoCidade ||
      !estadoNome
    ) {
      throw new BadRequestException('Dados do endereço e estado são obrigatórios.');
    }

    try {
      const newImovel = new Imovel();

      newImovel.tamanho = tamanho;
      newImovel.quantidadeComodos = quantidadeComodos;
      newImovel.mobiliado = mobiliado;
      newImovel.statusNegociacao = statusNegociacao;
      newImovel.valor = valor;
      newImovel.descricao = descricao;
      newImovel.numeroInscricao = numeroInscricao;
      newImovel.rgProprietario = rgProprietario;
      newImovel.cpfProprietario = cpfProprietario;
      newImovel.telefoneContato = telefoneContato;
      newImovel.emailContato = emailContato;
      newImovel.enderecoRua = enderecoRua;
      newImovel.enderecoNumero = enderecoNumero;
      newImovel.enderecoBairro = enderecoBairro;
      newImovel.enderecoCEP = enderecoCEP;
      newImovel.enderecoCidade = enderecoCidade;
      newImovel.estadoNome = estadoNome;

      if (pdfDocument) {
        newImovel.pdfDocument = pdfDocument.filename;
        console.log("Tem documento");
      }
      if (req.files && req.files.fotos) {
        newImovel.fotos = req.files.fotos.map((file) => ({
          filename: file.filename,
          originalname: file.originalname,
        }));
        console.log("Tem foto");
      }else{
        console.log("Não tem foto");
      }

      const user: User = req.user;
      newImovel.usuario = user;

      console.log("criando novo imovel =")
      console.log(newImovel)

      return await this.imovelService.createImovel(newImovel);
    } catch (error) {
      console.error('Erro ao criar o imóvel:', error);
      throw new InternalServerErrorException('Erro ao criar o imóvel');
    }
  }

  @Get()
  async findAll(): Promise<Imovel[]> {
    return this.imovelService.findAll();
  }

  //@UseGuards(AuthenticatedGuard)
  @Get('/cadastro-imovel')
  @Render('cadastro-imovel.html')
  async showCadastroImovelPage(@Request() req, @Res() res): Promise<{ userIsLoggedIn: boolean, user: User }> {
    const userIsLoggedIn = req.isAuthenticated(); 
    const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;
    //if(!user){res.redirect('/');}

    return { userIsLoggedIn, user };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/meus-imoveis')
  @Render('meus-imoveis.html')
  async showMeusImoveisPage(@Request() req, @Res() res): Promise<{ userIsLoggedIn: boolean, user: User, userImoveis: Imovel[] }> {
    const userIsLoggedIn = req.isAuthenticated(); 
    const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;
    //if(!user){res.redirect('/');}

    let userImoveis: Imovel[] = [];
    if (userIsLoggedIn) {
      userImoveis = await this.imovelService.findImoveisByUserId(user.id);
    }
    console.log(user.id);

    return { userIsLoggedIn, user, userImoveis };
  }

  
  @UseGuards(AuthenticatedGuard)
  @Get('/delete-imovel/:id')
  @Render('delete-imovel') // Renderiza a página de confirmação de exclusão
  async showDeleteImovelPage(@Param('id') id: string, @Req() req, @Res() res) {
  }
  
  @UseGuards(AuthenticatedGuard)
  @Post('delete-imovel/:id')
  async deleteImovel(@Param('id', ParseIntPipe) id: number, @Res() res) {
    const imovel = await this.imovelService.findOne(id);
    if (!imovel) {
      throw new NotFoundException('Imóvel não encontrado');
    }

    await this.imovelService.delete(id);
    return res.redirect('/imoveis/meus-imoveis');
    // return { message: 'Imóvel excluído com sucesso' };
  }


  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Imovel> {
    return this.imovelService.findOne(id);
  }

  @Get(':id/relevant-fields')
async findRelevantFields(@Param('id') id: number): Promise<{
  id: number;
  enderecoRua: string;
  enderecoNumero: string;
  enderecoBairro: string;
  enderecoCidade: string;
  valor: number;
}> {
  const imovel = await this.imovelService.findOne(id);
  if (!imovel) {
    return null;
  }

  const relevantFields = {
    id: imovel.id,
    enderecoRua: imovel.enderecoRua,
    enderecoNumero: imovel.enderecoNumero,
    enderecoBairro: imovel.enderecoBairro,
    enderecoCidade: imovel.enderecoCidade,
    valor: imovel.valor, 
  };

  return relevantFields;
}


  @Get('informacoes-imovel/:id')

  @Render('informacoes-imovel') // Substitua pelo nome do seu arquivo de visualização
  async showInformacoesImovelPage(@Param('id') id: number, @Res() res, @Request() req): Promise<{ imovel: Imovel, user: User, userIsLoggedIn: boolean }> {
    const userIsLoggedIn = req.isAuthenticated(); 
    const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;
    const imovel = await this.imovelService.findOne(id);
    if (!imovel) {
      throw new NotFoundException('Imóvel não encontrado');
    }
    
    return { imovel, user, userIsLoggedIn };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() imovel: Imovel): Promise<Imovel> {
    return this.imovelService.update(id, imovel);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard, AdminGuard)
  async delete(@Param('id') id: number): Promise<void> {
    return this.imovelService.delete(id);
  }
}
