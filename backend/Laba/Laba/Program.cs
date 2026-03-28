using System;
using System.Collections;
using System.Collections.Generic;

public class CollectionType<T> : IEnumerable<T>
{
    private List<T> _items;

    public CollectionType()
    {
        _items = new List<T>();
    }

    public CollectionType(IEnumerable<T> collection)
    {
        _items = new List<T>(collection);
    }

    ~CollectionType()
    {
        Console.WriteLine($"CollectionType<{typeof(T).Name}> finalized.");
    }

    public int Count => _items.Count;
    public bool IsReadOnly => false;

    public T this[int index]
    {
        get
        {
            if (index < 0 || index >= Count)
                throw new IndexOutOfRangeException("Index is out of range.");
            return _items[index];
        }
        set
        {
            if (index < 0 || index >= Count)
                throw new IndexOutOfRangeException("Index is out of range.");
            _items[index] = value;
        }
    }

    public void Add(T item)
    {
        if (item == null)
            throw new ArgumentNullException(nameof(item));
        _items.Add(item);
    }

    public void AddRange(IEnumerable<T> collection)
    {
        if (collection == null)
            throw new ArgumentNullException(nameof(collection));
        _items.AddRange(collection);
    }

    public bool Remove(T item)
    {
        if (item == null)
            throw new ArgumentNullException(nameof(item));
        return _items.Remove(item);
    }

    public void RemoveAt(int index)
    {
        if (index < 0 || index >= Count)
            throw new IndexOutOfRangeException("Index is out of range.");
        _items.RemoveAt(index);
    }

    public void Clear()
    {
        _items.Clear();
    }

    public bool Contains(T item)
    {
        return _items.Contains(item);
    }

    public T Find(Predicate<T> match)
    {
        if (match == null)
            throw new ArgumentNullException(nameof(match));
        return _items.Find(match);
    }

    public void Sort()
    {
        _items.Sort();
    }

    public void Sort(Comparison<T> comparison)
    {
        if (comparison == null)
            throw new ArgumentNullException(nameof(comparison));
        _items.Sort(comparison);
    }

    public T[] ToArray()
    {
        return _items.ToArray();
    }

    public IEnumerator<T> GetEnumerator()
    {
        return _items.GetEnumerator();
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }

    public static CollectionType<T> operator +(CollectionType<T> c1, CollectionType<T> c2)
    {
        if (c1 == null || c2 == null)
            throw new ArgumentNullException();
        var result = new CollectionType<T>(c1);
        result.AddRange(c2);
        return result;
    }
}

class Program
{
    static void Main()
    {
        var collection1 = new CollectionType<int>();
        collection1.Add(10);
        collection1.Add(20);
        collection1.Add(30);

        foreach (var item in collection1)
            Console.Write($"{item} ");
        Console.WriteLine($"\nCount: {collection1.Count}");

        Console.WriteLine($"Элемент [1]: {collection1[1]}");
        collection1[1] = 25;

        var collection2 = new CollectionType<int>(new[] { 5, 15, 25, 35, 45 });
        collection2.AddRange(new[] { 55, 65 });
        collection2.Remove(25);
        collection2.RemoveAt(0);

        Console.WriteLine($"Contains 35: {collection2.Contains(35)}");

        var found = collection2.Find(x => x > 40);
        Console.WriteLine($"First > 40: {found}");

        var unsorted = new CollectionType<int>(new[] { 9, 3, 7, 1, 5 });
        unsorted.Sort();

        foreach (var item in unsorted)
            Console.Write($"{item} ");
        Console.WriteLine();

        var array = unsorted.ToArray();
        var combined = collection1 + collection2;

        foreach (var item in combined)
            Console.Write($"{item} ");
        Console.WriteLine();

        combined.Clear();
        Console.WriteLine($"After clear: {combined.Count}");
    }
}