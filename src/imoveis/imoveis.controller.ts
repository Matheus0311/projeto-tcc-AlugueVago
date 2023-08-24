import { Controller, Post, Body, Get, Param, Put, Delete, InternalServerErrorException, Render, UseGuards, BadRequestException, Req, UseInterceptors, UploadedFile, Res, Request, ConsoleLogger, ParseIntPipe, Query, UploadedFiles, UsePipes, ValidationPipe  } from '@nestjs/common';
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
    return { user, userIsLoggedIn, errorMessages: errorMessagesArray, };
  }
  


  @Post('/cadastro-imovel')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(
  AnyFilesInterceptor()
  )
 async create(
    @Body() body: any,
    // @UploadedFile() pdfDocument: Express.Multer.File,
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
      newImovel.mobiliado = mobiliado === "1";
      newImovel.statusNegociacao = statusNegociacao === "1";
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
      newImovel.novo = novo === "1";
      newImovel.grande = grande === "1";
      newImovel.bemLocalizado = bemLocalizado === "1";
      newImovel.condominioFechado = condominioFechado === "1";
      newImovel.estacionamento = estacionamento === "1";
      newImovel.aguaGratuita = aguaGratuita === "1";
      newImovel.iptuIncluso = iptuIncluso === "1";
      const photos = []

      let pdfDocument = null;
  
      for (let file of files) {
        if (extname(file.originalname) === '.pdf') {
          pdfDocument = file
        }
        else {        
          const url = await this.photoService.saveFile(file, './uploads/fotos-imoveis');
          const photo = new Photo();
          photo.url = url
          photos.push(photo);
        }
      }
  
      const fotosEntidades = []
      try {
        await Promise.all(photos.map(photo => this.photoService.createPhoto(photo).then(photo2 => fotosEntidades.push(photo2))))
        console.log("Depois de salvar as fotos");
      } catch (error) {
        console.error("\n\n\nErro ao criar fotos por causa desse await Promise.all: ", error, "\n\n\n");
      }

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
      // Criação do imóvel com fotos e documentos
      const savedImovel = await this.imovelService.createImovelWithFiles(newImovel, fotosEntidades, pdfDocument);
  
      res.redirect('/imoveis/meus-imoveis');
      return savedImovel;
    } catch (error) {
      // Tratamento de erro
      console.error("Erro ao criar imóvel:", error);
      throw error;
    }
  }

  @Get('/uploads/documentos-imoveis/:pdfName')
  async serveImovelImage(@Param('pdfName') pdfName, @Res() res) {
    const imagePath = `./uploads/documentos-imoveis/${pdfName}`;
    // Envia o arquivo como resposta
    res.sendFile(imagePath, { root: '.' });
  }


  @Get('/edit-imovel/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @Render('edit-imovel.ejs')
  async showEditUserPage(
    @Request() req,
    @Res() res,
    @Param('id') imovelId: number, 
    @Query('errorMessages') errorMessages: string
  ): Promise<{ user: User; imovel: Imovel; userIsLoggedIn: boolean; errorMessages: string }> {
    const userIsLoggedIn = req.isAuthenticated();
    const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;
    const errorMessagesArray = errorMessages ? JSON.parse(errorMessages) : [];
  
    const imovel = await this.imovelService.findById(imovelId); 
    if (!user) {
      res.redirect('/');
    }

    if (imovel) {
      const fotos = imovel.photos; 
    } else {
      res.redirect('/imoveis/meus-imoveis');
    }
  
    return { user: user, imovel: imovel, userIsLoggedIn, errorMessages: errorMessagesArray };
  }
  
  @Post('/edit-imovel/:id')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id') imovelId: number,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
    @Res() res,
  ): Promise<Imovel> {
    const imovel = await this.imovelService.findById(imovelId);
  
    if (!imovel) {
      throw new NotFoundException('Imóvel não encontrado');
    }
  
    imovel.tamanho = body.tamanho;
    imovel.quantidadeComodos = body.quantidadeComodos;
    imovel.mobiliado = body.mobiliado === '1';
    imovel.statusNegociacao = body.statusNegociacao === '1';
    imovel.valor = body.valor;
    imovel.descricao = body.descricao;
    imovel.numeroInscricao = body.numeroInscricao;
    imovel.rgProprietario = body.rgProprietario;
    imovel.cpfProprietario = body.cpfProprietario;
    imovel.telefoneContato = body.telefoneContato;
    imovel.emailContato = body.emailContato;
    imovel.enderecoRua = body.enderecoRua;
    imovel.enderecoNumero = body.enderecoNumero;
    imovel.enderecoBairro = body.enderecoBairro;
    imovel.enderecoCEP = body.enderecoCEP;
    imovel.enderecoCidade = body.enderecoCidade;
    imovel.estadoNome = body.estadoNome;
    imovel.tipoImovel = body.tipoImovel;
    imovel.novo = body.novo === '1';
    imovel.grande = body.grande === '1';
    imovel.bemLocalizado = body.bemLocalizado === '1';
    imovel.condominioFechado = body.condominioFechado === '1';
    imovel.estacionamento = body.estacionamento === '1';
    imovel.aguaGratuita = body.aguaGratuita === '1';
    imovel.iptuIncluso = body.iptuIncluso === '1';

    console.log("Antes da atualização das fotos: ", imovel.photos);

    try {
      const existingImovel = await this.imovelService.findById(imovelId);

      // Cria novas entidades de fotos e as associa ao imóvel
      const newPhotos = [];
      for (let file of files) {
        if (extname(file.originalname) !== '.pdf') {
          const url = await this.photoService.saveFile(file, './uploads/fotos-imoveis');
          const photo = new Photo();
          photo.url = url;
          photo.imovel = existingImovel;
          console.log("photo.imovel.id: ", photo.imovel.id);
          console.log("existingImovel.id: ", existingImovel.id);
          newPhotos.push(photo);
        }
      }

      console.log("Depois da atualização das fotos: ", imovel.photos);

      // Atualiza o objeto imovel com as novas fotos
      if (newPhotos.length > 0) {
        imovel.photos = newPhotos;
      }

      // Atualiza o caminho do PDF se um novo PDF foi enviado
      if (req.files && req.files.length > 0) {
        const pdfDocument = req.files.find(file => extname(file.originalname) === '.pdf');
        if (pdfDocument) {
          const pdfPath = await this.imovelService.saveFile(pdfDocument, './uploads/documentos-imoveis');
          imovel.pdfDocument = pdfPath;
        }
      }

      // Salva as novas entidades de fotos no banco de dados
      if (newPhotos.length > 0) {
        await this.photoService.createPhotos(newPhotos);
      }

      const updatedImovel = await this.imovelService.update(imovelId, imovel);

      res.redirect(`/imoveis/meus-imoveis`);
      return updatedImovel;
    } catch (error) {
      console.error("Erro durante a atualização do imóvel:", error);
      throw error;
    }
  }
  

  // @UseGuards(AuthenticatedGuard, AdminGuard)
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

  @Get('/uploads/fotos-imoveis/:imageName')
  async serveRotaImovelImage(@Param('imageName') imageName, @Res() res) {
    const imagePath = `./uploads/fotos-imoveis/${imageName}`;
    // Envia o arquivo como resposta
    res.sendFile(imagePath, { root: '.' });
  }

  @Get('/informacoes-imovel/uploads/fotos-imoveis/:imageName')
  async serveRotaInformacaoImovelImage(@Param('imageName') imageName, @Res() res) {
    const imagePath = `./uploads/fotos-imoveis/${imageName}`;
    // Envia o arquivo como resposta
    res.sendFile(imagePath, { root: '.' });
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

  @UseGuards(AuthenticatedGuard, AdminGuard)
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

  // @UseGuards(AuthenticatedGuard, AdminGuard)
  // @Put(':id')
  // async update(@Param('id') id: number, @Body() imovel: Imovel): Promise<Imovel> {
  //   return this.imovelService.update(id, imovel);
  // }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard, AdminGuard)
  async delete(@Param('id') id: number): Promise<void> {
    return this.imovelService.delete(id);
  }
}
