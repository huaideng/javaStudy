public class TestClass {
    private String name;
    private String description;
    private int value;

    public TestClass() {
        this.name = "default";
        this.value = 0;
        this.description = "default description";
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void display() {
        System.out.println("Name: " + name + ", Value: " + value + ", Description: " + description);
    }
}