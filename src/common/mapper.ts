export abstract class Mapper<T, K> {
   public abstract toDomain(data: T):K 
   public abstract toPersistence(data: K):T 
}
