/*
Count all product to tag relationships where tag_id is 1 or 3:

select products.id, count(tag_id) from
 products join products_tags on products.id = products_tags.product_id
 where tag_id in (1,3)
 group by products.id
 */


select * from products where products.id in (
select products.id from
 products join products_tags on products.id = products_tags.product_id
 where tag_id in (1,3)
 group by products.id
 having count(tag_id) >= 2
);
 