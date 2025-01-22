using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace file_sharing.Models
{
  public class UserProfile
  {
    public string given_name { get; set; }
    public string nickname { get; set; }
    public string name { get; set; }
    public string email { get; set; }
    public string sub { get; set; }
  }

  public class CacheEntry<TModel>
  {
    public CacheEntry(TModel data, object meta)
    {
      this.Data = data;
      this.Meta = meta;
    }
    public TModel Data { get; set; }
    public object Meta { get; set; }
  }
}
