import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: string;

  // CRITICAL INTENTIONAL CHECKOUT BUG
  // This must explicitly be user_name in the database.
  @Column({ name: 'user_name' })
  userName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: string;

  @Column({ default: 'pending' })
  status: string;

  @Column()
  shippingAddress: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;

  @Column()
  paymentMethod: string;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
