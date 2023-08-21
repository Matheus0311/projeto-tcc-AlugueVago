import { Controller, Post, Body, Get, Param, Put, Delete, InternalServerErrorException, Render, UseGuards, BadRequestException, Req, UseInterceptors, UploadedFile, Res, Request, ConsoleLogger, ParseIntPipe, Query, UploadedFiles  } from '@nestjs/common';
import { ImovelService } from './imoveis.service';
import { Imovel } from './imovel.entity';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { User } from 'src/users/user.entity';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from 'src/users/users.service';
import * as fs from 'fs';
import { useBeforeUnload } from 'react-router-dom';
export interface ExtendedUser extends User {
  userImoveis: Imovel[];
}
export interface AverageRating {
  imovelId: number;
  mediaNotas: number;
  numAvaliacoes: number;
}
import { NotFoundException } from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { AvaliacaoService } from 'src/avaliacoes/avaliacoes.service';
import { Photo } from 'src/photos/photo.entity';
import { PhotosService } from 'src/photos/photos.service';



@Controller('imoveis')
export class ImovelController {
  constructor(private readonly imovelService: ImovelService, 
    private readonly usersService: UsersService, 
    private readonly avaliacaoService: AvaliacaoService, 
    private readonly photoService: PhotosService,
    ) {}


  @UseGuards(AuthenticatedGuard)
  @Get('cadastro-imovel')
  @Render('cadastro-imovel.ejs')
  async showCadastroImovelPage(@Request() req, @Res() res, @Query('errorMessages') errorMessages: string): Promise<{ user: User, userIsLoggedIn: boolean, errorMessages: string }> {
    const userIsLoggedIn = req.isAuthenticated();
    const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;
    const errorMessagesArray = errorMessages ? JSON.parse(errorMessages) : [];
    if (!user) {
      res.redirect('/');
    }
    return { user, userIsLoggedIn, errorMessages: errorMessagesArray };
  }
  


  @Post('/cadastro-imovel')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(
  //   FileInterceptor('pdfDocument', {
  //   storage: diskStorage({
  //     destination: './uploads/documentos-imoveis',
  //     filename: (req, file, callback) => {
  //       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  //       callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
  //     },
  //   }),
  // }),
  // FilesInterceptor('fotos', 6, {
  //   storage: diskStorage({
  //     destination: (req, file, callback) => {
  //       // const user: User = req.user as User; 
  //       console.log("fotos");
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
  // )
  AnyFilesInterceptor()
  )
 async create(
    @Body() body: any,
    @UploadedFile() pdfDocument: Express.Multer.File,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
    @Res() res,
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
      tipoImovel, 
      novo,
      grande,
      bemLocalizado,
      condominioFechado,
      estacionamento,
      aguaGratuita,
      iptuIncluso
    } = body;
    console.log("body = ", body)

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
      newImovel.tipoImovel = tipoImovel;
      newImovel.novo = novo;
      newImovel.grande = grande;
      newImovel.bemLocalizado = bemLocalizado;
      newImovel.condominioFechado = condominioFechado;
      newImovel.estacionamento = estacionamento;
      newImovel.aguaGratuita = aguaGratuita;
      newImovel.iptuIncluso = iptuIncluso;

      // if (pdfDocument) {
      //   newImovel.pdfDocument = pdfDocument.filename;
      //   console.log("Tem documento");
      // }
    
      // if (files && files.length > 0) {
      //   newImovel.fotos = files.map((file) => ({
      //     filename: file.filename,
      //     originalname: file.originalname,
      //   }));
      //   console.log("Tem foto(s)");
      // } else {
      //   console.log("Não tem foto(s)");
      // }
    
      // const user: User = req.user;
      // newImovel.usuario = user;
    
      // console.log("Criando novo imóvel:");
      // console.log(newImovel);
    
     // return await this.imovelService.createImovel(newImovel);

    //  newImovel.photos = req.files.map((file) => {
    //   const photo = new Photo();
    //   const uniqueToken = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    //   photo.url = `./uploads/fotos-imovel/${uniqueToken}${extname(file.originalname)}`;
    //   photo.imovel = newImovel;
    //   return photo;
    // });

    // await newImovel.photos.forEach(async (photo) => {
    //   await this.photoService.createPhoto(photo)
    // })
    // console.log("Tem foto");

    // const user: User = req.user;
    // newImovel.usuario = user;

    // console.log("criando novo imovel =")
    // console.log(newImovel)

    // return await this.imovelService.createImovelWithFiles(newImovel, newImovel.photos, pdfDocument);

    // } catch (error) {
    //   console.log("Caiu no erro do cadastro");
  
    //   res.redirect("/imoveis/cadastro-imovel");
    // }
     // Criação das fotos
     const photos = files.map(file => {
      const photo = new Photo();
      const uniqueToken = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      photo.url = `./uploads/fotos-imovel/${uniqueToken}${extname(file.originalname)}`;
      photo.imovel = newImovel;
      console.log("Funcionou aqui nas fotos")
      return photo;
    });

    console.log("Antes de salvar as fotos");
    // Salva as fotos no banco ou em cache, como preferir
    try {
      await Promise.all(photos.map(photo => this.photoService.createPhoto(photo)))
      console.log("Depois de salvar as fotos");
    } catch (error) {
      console.error("\n\n\nErro ao criar fotos por causa desse await Promise.all: ", error, "\n\n\n");
      // Lidar com o erro de alguma forma
    }
    

    
    // Associa as fotos ao imóvel
    newImovel.photos = photos
    console.log("newImovel.photos = ", newImovel.photos);


    // Associa o usuário logado ao imóvel
    const user: User = req.user;
    newImovel.usuario = user;
    console.log("Usuário dono do imóvel = ", newImovel.usuario);

    // Se houver um documento PDF, guarda o caminho
    if (pdfDocument) {
      const pdfPath = await this.imovelService.saveFile(pdfDocument, './uploads/documentos-imoveis');
      newImovel.pdfDocument = pdfPath;
      console.log("PDF = ", pdfDocument);
    }

    console.log("\n\n\nAntes de chamar createImovelWithFiles\n\n\n")
    // Criação do imóvel com fotos e documentos
    const savedImovel = await this.imovelService.createImovelWithFiles(newImovel, photos, pdfDocument);

    return savedImovel;
  } catch (error) {
    // Tratamento de erro
    console.error("Erro ao criar imóvel:", error);
    throw error;
  }
  }

  @Get()
  async findAll(): Promise<Imovel[]> {
    return this.imovelService.findAll();
  }


  @UseGuards(AuthenticatedGuard)
  @Get('/meus-imoveis')
  @Render('meus-imoveis.html')
  async showMeusImoveisPage(@Request() req, @Res() res): Promise<{ userIsLoggedIn: boolean, user: User, userImoveis: Imovel[] }> {
    const userIsLoggedIn = req.isAuthenticated(); 
    const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;
    if(!user){res.redirect('/');}

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
  }


  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Imovel> {
    return this.imovelService.findOne(id);
  }

  @Get(':id/media-notas')
  async getAverageRating(@Param('id', ParseIntPipe) id: number): Promise<AverageRating> {
    return this.avaliacaoService.calculateAverageRating(id);
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
  @Render('informacoes-imovel')
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
