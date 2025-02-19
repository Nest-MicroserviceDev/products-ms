import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto} from 'src/common';
import { NotFoundError } from 'rxjs';
import { date } from 'joi';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  
  private readonly logger = new Logger('ProductsService');

  async onModuleInit() {
    try {
        await this.$connect();
        this.logger.log('Database connected successfully.');
    } catch (error) {
        this.logger.error('Failed to connect to the database', error);
        throw error;
    }
}

  
  async create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page=1 , limit=10 } = paginationDto;
    const totalpages = await this.product.count({where: {available:true}});
    const lastPage = Math.ceil(totalpages/limit);

    return {
      data: await this.product.findMany({
        skip : (page -1 ) * limit,
        take: limit,
        where:{
          available:true
        }
      }),
      meta: {
        total: totalpages,
        page:page,
        lastPage : lastPage,
        }

    }
  }
  async findOne(id: number) {
    const product = await this.product.findFirst({
        where: { id, available: true }
    });
    if(!product){
      throw new NotFoundException(`Product with id ${id} no found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.product.update({
      where: { id, },
      data: updateProductDto
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    //return this.product.delete({
      //where: {id}
    //});
  const product = await this.product.update({
    where: {id},
    data: {
      available: false
    }

  });
    return product;

  }
    
}