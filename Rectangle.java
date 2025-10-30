public class Rectangle {
    private double length;
    private double width;

    public Rectangle(double length, double width) {
        this.length = length;
        this.width = width;
    }

    public double getArea() {
        return length * width;
    }

    public double getPerimeter() {
        return 2 * (length + width);
    }
    
    public void displayInfo() {
        System.out.println("Rectangle dimensions: " + length + " x " + width);
        System.out.println("Area: " + getArea());
        System.out.println("Perimeter: " + getPerimeter());
    }

    // Adding a new method to scale the rectangle
    public void scale(double factor) {
        this.length *= factor;
        this.width *= factor;
        System.out.println("Rectangle scaled by factor of " + factor);
    }

    public static void main(String[] args) {
        Rectangle rect = new Rectangle(10, 5);
        rect.displayInfo();
        
        // Scaling the rectangle
        rect.scale(2.0);
        rect.displayInfo();
    }
}