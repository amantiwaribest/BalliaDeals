export type Category = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  averageRating: number;
  reviews: number;
  email: string;
  role?: 'user' | 'admin';
  mobile?: string;
  dob?: string;
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  sellerId: string;
  imageUrl: string;
  imageHint: string;
  salaryPeriod?: 'year' | 'month' | 'hour';
  createdAt?: string;
  seller?: User;
  category?: Category;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  autoRejected?: boolean;
};
