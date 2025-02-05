import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Catalogo } from '../entities/catalogo.entity';

@Injectable()
export class CatalogoSeeder {
  constructor(
    @InjectRepository(Catalogo)
    private readonly catalogoRepository: Repository<Catalogo>,
  ) {}

  async seed() {
    const data = [
      { id_level: 1, url_imagen: 'https://res.cloudinary.com/drogh0pli/image/upload/v1738712516/profile_pictures/hm6tvaddxvgk9xbuwrui.png' },
      { id_level: 1, url_imagen: 'https://res.cloudinary.com/drogh0pli/image/upload/v1738712671/profile_pictures/cxbihtyhghdxkbww4pgn.png' },
      { id_level: 1, url_imagen: 'https://res.cloudinary.com/drogh0pli/image/upload/v1738712902/profile_pictures/bhqydpv9f65vetiom2b6.png' },
      { id_level: 2, url_imagen: 'https://res.cloudinary.com/drogh0pli/image/upload/v1738713102/profile_pictures/cao9ri5zqcrdeqe0n1nq.png' },
      { id_level: 2, url_imagen: 'https://res.cloudinary.com/drogh0pli/image/upload/v1738713261/profile_pictures/tzque0frqqyrqqvur7nf.png' },
      { id_level: 2, url_imagen: 'https://res.cloudinary.com/drogh0pli/image/upload/v1738713336/profile_pictures/gvyt9nax7hoamaruuziy.png' },
      { id_level: 3, url_imagen: 'https://res.cloudinary.com/drogh0pli/image/upload/v1738713475/profile_pictures/ch3niwmmhr8fs7h4z6nq.png' },
      { id_level: 3, url_imagen: 'https://res.cloudinary.com/drogh0pli/image/upload/v1738713746/profile_pictures/owusenlvnmtgkrskaeqb.png' },
      { id_level: 3, url_imagen: 'https://res.cloudinary.com/drogh0pli/image/upload/v1738713935/profile_pictures/mtxsj0wfhmxid8yfebmw.png' },
    ];

    for (const item of data) {
      const exists = await this.catalogoRepository.findOne({ where: { url_imagen: item.url_imagen } });
      if (!exists) {
        await this.catalogoRepository.save(this.catalogoRepository.create(item));
      }
    }
  }
}
