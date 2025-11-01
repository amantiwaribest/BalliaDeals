import {
  AllCategoriesIcon,
  CarIcon,
  MobileIcon,
  BikeIcon,
  RealEstateIcon,
  ElectronicsIcon,
  BriefcaseIcon,
  WrenchIcon,
  CouchIcon,
  BookIcon,
  SportsBallIcon,
  EllipsisHorizontalIcon,
  GridIcon,
  ShoppingBagIcon,
} from './icons';

interface CategoryIconProps {
  categoryName: string;
  className?: string;
}

const CategoryIcon = ({ categoryName, className }: CategoryIconProps) => {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'All': GridIcon,
    'Cars': CarIcon,
    'Mobiles': MobileIcon,
    'Bikes': BikeIcon,
    'Real Estate': RealEstateIcon,
    'Electronics': ElectronicsIcon,
    'Jobs': BriefcaseIcon,
    'Services': WrenchIcon,
    'Furniture': CouchIcon,
    'Books': BookIcon,
    'Sports': SportsBallIcon,
    'Others': EllipsisHorizontalIcon,
  };

  const IconComponent = iconMap[categoryName] || ShoppingBagIcon;

  return <IconComponent className={className} />;
};

export default CategoryIcon;
