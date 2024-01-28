export abstract class Mapper<T, K, L> {
   public abstract toDomain(data: T):K 
   public abstract toPersistence(data: K):T 
   public abstract toDTO(data: K):L 
}
