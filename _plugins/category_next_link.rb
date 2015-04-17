module Jekyll
  class CategoryAwareNextGenerator < Generator

    safe true
    priority :high

    def generate(site)
      site.categories.each_pair do |category_name, posts|
        posts.sort! { |a, b| b <=> a }

        posts.each do |post|
          position = posts.index post

          category_previous = nil
          category_next = nil

          if position && position < posts.length - 1
            i = 1
            # while defined? posts[position + i].data["archived"] || defined? posts[position + i].data["redirectURL"] do
            #   i += 1
            # end

            category_previous = posts[position + i]
          end

          if position && position > 0
            i = 1
            # while defined? posts[position - i].data["archived"] || defined? posts[position - i].data["redirectURL"] do
            #   i += 1
            # end

            category_next = posts[position - i]
          end

          post.data["#{category_name}_next"] = category_next unless category_next.nil?
          post.data["#{category_name}_previous"] = category_previous unless category_previous.nil?
        end
      end
    end
  end
end