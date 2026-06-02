public class House 
{
    public House(int windows, int doors, int rooms, 
                 bool hasGarage, bool hasSwimPool, 
                 bool hasStatues, bool hasGarden) 
    {
        this.windows = windows;
        this.doors = doors;
        this.hasGarage = hasGarage;
    }
}

class Program
{
    public static void Main(string[] args)
    {
        House simpleHouse = new House(4, 2, 4, false, false, false, false);
        House luxuryHouse = new House(10, 4, 8, true, true, true, true);
    }
}

public interface IHouseBuilder 
{
    void BuildWalls();
    void BuildDoors();
    void BuildGarage();
    House GetResult();
}

public class StoneHouseBuilder : IHouseBuilder 
{
    private House _house = new House();
    
    public void BuildWalls() => _house.Add("Stone Walls");
    public void BuildDoors() => _house.Add("Oak Doors");
    public void BuildGarage() => _house.Add("Stone Garage");
    
    public House GetResult() => _house;
}

public class Director 
{
    private IHouseBuilder _builder;

    public Director(IHouseBuilder builder) 
    {
        _builder = builder;
    }

    public void ConstructMinimalHouse() 
    {
        _builder.BuildWalls();
        _builder.BuildDoors();
    }
}

class Program
{
    public static void Main(string[] args)
    {
        var builder = new StringBuilder();

        string result = builder
            .Append("Hello, ")
            .AppendLine(".NET!")
            .Replace("Hello", "Hi")
            .ToString();
    }
}