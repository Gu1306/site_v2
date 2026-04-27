interface CareFitLogoProps {
  size?: number;
  className?: string;
}

const CareFitLogo = ({ size = 58, className = "" }: CareFitLogoProps) => {
  return (
    <img 
      src="/lovable-uploads/ab867861-34d3-4723-99e3-c7b8d35f0c46.png"
      alt="CareFit Run Base"
      className={className}
      style={{ width: size, height: size }}
    />
  );
};

export default CareFitLogo;