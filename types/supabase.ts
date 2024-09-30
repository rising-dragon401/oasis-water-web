export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          company: number | null
          created_at: string
          id: number
          image: string | null
          name: string
        }
        Insert: {
          company?: number | null
          created_at?: string
          id?: number
          image?: string | null
          name: string
        }
        Update: {
          company?: number | null
          created_at?: string
          id?: number
          image?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_company_fkey"
            columns: ["company"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          id: number
          image: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          image?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          image?: string | null
          name?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      deletion_requests: {
        Row: {
          created_at: string
          id: number
          user_id_to_delete: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          user_id_to_delete?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          user_id_to_delete?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deletion_requests_user_id_to_delete_fkey"
            columns: ["user_id_to_delete"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          created_at: string | null
          embedding: string | null
          id: number
          original_id: number | null
          original_table: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: number
          original_id?: number | null
          original_table?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: number
          original_id?: number | null
          original_table?: string | null
        }
        Relationships: []
      }
      email_lists: {
        Row: {
          created_at: string
          email: string
          id: number
          list: Database["public"]["Enums"]["email_subscriptions"] | null
          subscribed: boolean
          uid: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          list?: Database["public"]["Enums"]["email_subscriptions"] | null
          subscribed: boolean
          uid?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          list?: Database["public"]["Enums"]["email_subscriptions"] | null
          subscribed?: boolean
          uid?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: number
          item_id: number
          type: Database["public"]["Enums"]["item_type"] | null
          uid: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          item_id: number
          type?: Database["public"]["Enums"]["item_type"] | null
          uid?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          item_id?: number
          type?: Database["public"]["Enums"]["item_type"] | null
          uid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          benefits: string | null
          bonus_score: number | null
          category: Database["public"]["Enums"]["ingredient_category"] | null
          description: string | null
          health_guideline: number | null
          id: number
          image: string | null
          is_common: boolean | null
          is_contaminant: boolean | null
          legal_limit: number | null
          measure: string | null
          name: string
          risks: string | null
          severity_score: number | null
          sources: Json[] | null
          updated_at: string | null
        }
        Insert: {
          benefits?: string | null
          bonus_score?: number | null
          category?: Database["public"]["Enums"]["ingredient_category"] | null
          description?: string | null
          health_guideline?: number | null
          id?: number
          image?: string | null
          is_common?: boolean | null
          is_contaminant?: boolean | null
          legal_limit?: number | null
          measure?: string | null
          name: string
          risks?: string | null
          severity_score?: number | null
          sources?: Json[] | null
          updated_at?: string | null
        }
        Update: {
          benefits?: string | null
          bonus_score?: number | null
          category?: Database["public"]["Enums"]["ingredient_category"] | null
          description?: string | null
          health_guideline?: number | null
          id?: number
          image?: string | null
          is_common?: boolean | null
          is_contaminant?: boolean | null
          legal_limit?: number | null
          measure?: string | null
          name?: string
          risks?: string | null
          severity_score?: number | null
          sources?: Json[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invite_codes: {
        Row: {
          created_at: string
          id: string
          redemptions: string[] | null
          uid: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          redemptions?: string[] | null
          uid?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          redemptions?: string[] | null
          uid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invite_codes_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          affiliate_url: string | null
          brand: number | null
          company: number
          created_at: string
          description: string | null
          filtration_methods:
            | Database["public"]["Enums"]["water_filtration_methods"][]
            | null
          fts: unknown | null
          id: number
          image: string
          ingredients: Json[] | null
          is_distilled: boolean | null
          is_indexed: boolean | null
          is_private: boolean | null
          metadata: Json | null
          name: string
          nutrients: Json[] | null
          packaging: Database["public"]["Enums"]["packaging"] | null
          recommended: boolean | null
          score: number | null
          sources: Json[] | null
          tags: string | null
          type: Database["public"]["Enums"]["item_type"]
          water_source:
            | Database["public"]["Enums"]["bottled_water_source"]
            | null
        }
        Insert: {
          affiliate_url?: string | null
          brand?: number | null
          company: number
          created_at?: string
          description?: string | null
          filtration_methods?:
            | Database["public"]["Enums"]["water_filtration_methods"][]
            | null
          fts?: unknown | null
          id?: number
          image: string
          ingredients?: Json[] | null
          is_distilled?: boolean | null
          is_indexed?: boolean | null
          is_private?: boolean | null
          metadata?: Json | null
          name: string
          nutrients?: Json[] | null
          packaging?: Database["public"]["Enums"]["packaging"] | null
          recommended?: boolean | null
          score?: number | null
          sources?: Json[] | null
          tags?: string | null
          type: Database["public"]["Enums"]["item_type"]
          water_source?:
            | Database["public"]["Enums"]["bottled_water_source"]
            | null
        }
        Update: {
          affiliate_url?: string | null
          brand?: number | null
          company?: number
          created_at?: string
          description?: string | null
          filtration_methods?:
            | Database["public"]["Enums"]["water_filtration_methods"][]
            | null
          fts?: unknown | null
          id?: number
          image?: string
          ingredients?: Json[] | null
          is_distilled?: boolean | null
          is_indexed?: boolean | null
          is_private?: boolean | null
          metadata?: Json | null
          name?: string
          nutrients?: Json[] | null
          packaging?: Database["public"]["Enums"]["packaging"] | null
          recommended?: boolean | null
          score?: number | null
          sources?: Json[] | null
          tags?: string | null
          type?: Database["public"]["Enums"]["item_type"]
          water_source?:
            | Database["public"]["Enums"]["bottled_water_source"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "items_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_company_fkey"
            columns: ["company"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      nods_page: {
        Row: {
          checksum: string | null
          id: number
          meta: Json | null
          parent_page_id: number | null
          path: string
          source: string | null
          type: string | null
        }
        Insert: {
          checksum?: string | null
          id?: number
          meta?: Json | null
          parent_page_id?: number | null
          path: string
          source?: string | null
          type?: string | null
        }
        Update: {
          checksum?: string | null
          id?: number
          meta?: Json | null
          parent_page_id?: number | null
          path?: string
          source?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nods_page_parent_page_id_fkey"
            columns: ["parent_page_id"]
            isOneToOne: false
            referencedRelation: "nods_page"
            referencedColumns: ["id"]
          },
        ]
      }
      nods_page_section: {
        Row: {
          content: string | null
          embedding: string | null
          heading: string | null
          id: number
          page_id: number
          slug: string | null
          token_count: number | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          heading?: string | null
          id?: number
          page_id: number
          slug?: string | null
          token_count?: number | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          heading?: string | null
          id?: number
          page_id?: number
          slug?: string | null
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nods_page_section_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "nods_page"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrients: {
        Row: {
          benefits: string | null
          created_at: string
          id: number
          name: string | null
          risks: string | null
          sources: Json[] | null
          unit: string | null
        }
        Insert: {
          benefits?: string | null
          created_at?: string
          id?: number
          name?: string | null
          risks?: string | null
          sources?: Json[] | null
          unit?: string | null
        }
        Update: {
          benefits?: string | null
          created_at?: string
          id?: number
          name?: string | null
          risks?: string | null
          sources?: Json[] | null
          unit?: string | null
        }
        Relationships: []
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          id: number
          price_id: string | null
          referring_user_id: string | null
          status: string | null
          subscription_id: string | null
          subscription_status: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          id?: number
          price_id?: string | null
          referring_user_id?: string | null
          status?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          id?: number
          price_id?: string | null
          referring_user_id?: string | null
          status?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      research: {
        Row: {
          created_at: string
          file_url: string | null
          id: number
          title: string | null
        }
        Insert: {
          created_at?: string
          file_url?: string | null
          id?: number
          title?: string | null
        }
        Update: {
          created_at?: string
          file_url?: string | null
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number | null
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tap_water_locations: {
        Row: {
          created_at: string
          id: number
          image: string | null
          is_featured: boolean | null
          name: string
          score: number | null
          state: string | null
          type: Database["public"]["Enums"]["item_type"]
          utilities: Json[] | null
        }
        Insert: {
          created_at?: string
          id?: number
          image?: string | null
          is_featured?: boolean | null
          name: string
          score?: number | null
          state?: string | null
          type: Database["public"]["Enums"]["item_type"]
          utilities?: Json[] | null
        }
        Update: {
          created_at?: string
          id?: number
          image?: string | null
          is_featured?: boolean | null
          name?: string
          score?: number | null
          state?: string | null
          type?: Database["public"]["Enums"]["item_type"]
          utilities?: Json[] | null
        }
        Relationships: []
      }
      users: {
        Row: {
          assistant_id: string | null
          avatar_url: string | null
          billing_address: Json | null
          bio: string | null
          created_at: string
          email: string | null
          followers: string[] | null
          following: string[] | null
          full_name: string | null
          has_redeemed_free: boolean | null
          has_reviewed_app: boolean | null
          id: string
          is_featured: boolean | null
          is_oasis_public: boolean | null
          metadata: Json | null
          payment_method: Json | null
          permissions: Database["public"]["Enums"]["permission"] | null
          redeemed_invite_code: string | null
          referred_by: string | null
          score: number | null
          username: string | null
        }
        Insert: {
          assistant_id?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          bio?: string | null
          created_at?: string
          email?: string | null
          followers?: string[] | null
          following?: string[] | null
          full_name?: string | null
          has_redeemed_free?: boolean | null
          has_reviewed_app?: boolean | null
          id: string
          is_featured?: boolean | null
          is_oasis_public?: boolean | null
          metadata?: Json | null
          payment_method?: Json | null
          permissions?: Database["public"]["Enums"]["permission"] | null
          redeemed_invite_code?: string | null
          referred_by?: string | null
          score?: number | null
          username?: string | null
        }
        Update: {
          assistant_id?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          bio?: string | null
          created_at?: string
          email?: string | null
          followers?: string[] | null
          following?: string[] | null
          full_name?: string | null
          has_redeemed_free?: boolean | null
          has_reviewed_app?: boolean | null
          id?: string
          is_featured?: boolean | null
          is_oasis_public?: boolean | null
          metadata?: Json | null
          payment_method?: Json | null
          permissions?: Database["public"]["Enums"]["permission"] | null
          redeemed_invite_code?: string | null
          referred_by?: string | null
          score?: number | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_redeemed_invite_code_fkey"
            columns: ["redeemed_invite_code"]
            isOneToOne: false
            referencedRelation: "invite_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      water_filters: {
        Row: {
          affiliate_url: string | null
          brand: number | null
          certifications: Database["public"]["Enums"]["certifications"][] | null
          company: number
          contaminants_filtered: number[] | null
          created_at: string
          description: string | null
          filtered_contaminant_categories: Json[] | null
          id: number
          image: string | null
          is_draft: boolean | null
          is_indexed: boolean | null
          name: string
          percent_common_filtered: number | null
          percent_uncommon_filtered: number | null
          recommended: boolean | null
          score: number | null
          sources: Json[] | null
          tags: string | null
          type: Database["public"]["Enums"]["item_type"]
        }
        Insert: {
          affiliate_url?: string | null
          brand?: number | null
          certifications?:
            | Database["public"]["Enums"]["certifications"][]
            | null
          company: number
          contaminants_filtered?: number[] | null
          created_at?: string
          description?: string | null
          filtered_contaminant_categories?: Json[] | null
          id?: number
          image?: string | null
          is_draft?: boolean | null
          is_indexed?: boolean | null
          name: string
          percent_common_filtered?: number | null
          percent_uncommon_filtered?: number | null
          recommended?: boolean | null
          score?: number | null
          sources?: Json[] | null
          tags?: string | null
          type: Database["public"]["Enums"]["item_type"]
        }
        Update: {
          affiliate_url?: string | null
          brand?: number | null
          certifications?:
            | Database["public"]["Enums"]["certifications"][]
            | null
          company?: number
          contaminants_filtered?: number[] | null
          created_at?: string
          description?: string | null
          filtered_contaminant_categories?: Json[] | null
          id?: number
          image?: string | null
          is_draft?: boolean | null
          is_indexed?: boolean | null
          name?: string
          percent_common_filtered?: number | null
          percent_uncommon_filtered?: number | null
          recommended?: boolean | null
          score?: number | null
          sources?: Json[] | null
          tags?: string | null
          type?: Database["public"]["Enums"]["item_type"]
        }
        Relationships: [
          {
            foreignKeyName: "water_filters_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "water_filters_company_fkey"
            columns: ["company"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_items_with_ingredient: {
        Args: {
          ingredient_id: number
        }
        Returns: {
          affiliate_url: string | null
          brand: number | null
          company: number
          created_at: string
          description: string | null
          filtration_methods:
            | Database["public"]["Enums"]["water_filtration_methods"][]
            | null
          fts: unknown | null
          id: number
          image: string
          ingredients: Json[] | null
          is_distilled: boolean | null
          is_indexed: boolean | null
          is_private: boolean | null
          metadata: Json | null
          name: string
          nutrients: Json[] | null
          packaging: Database["public"]["Enums"]["packaging"] | null
          recommended: boolean | null
          score: number | null
          sources: Json[] | null
          tags: string | null
          type: Database["public"]["Enums"]["item_type"]
          water_source:
            | Database["public"]["Enums"]["bottled_water_source"]
            | null
        }[]
      }
      get_page_parents: {
        Args: {
          page_id: number
        }
        Returns: {
          id: number
          parent_page_id: number
          path: string
          meta: Json
        }[]
      }
      get_random_filters: {
        Args: Record<PropertyKey, never>
        Returns: {
          affiliate_url: string | null
          brand: number | null
          certifications: Database["public"]["Enums"]["certifications"][] | null
          company: number
          contaminants_filtered: number[] | null
          created_at: string
          description: string | null
          filtered_contaminant_categories: Json[] | null
          id: number
          image: string | null
          is_draft: boolean | null
          is_indexed: boolean | null
          name: string
          percent_common_filtered: number | null
          percent_uncommon_filtered: number | null
          recommended: boolean | null
          score: number | null
          sources: Json[] | null
          tags: string | null
          type: Database["public"]["Enums"]["item_type"]
        }[]
      }
      get_random_items: {
        Args: Record<PropertyKey, never>
        Returns: {
          affiliate_url: string | null
          brand: number | null
          company: number
          created_at: string
          description: string | null
          filtration_methods:
            | Database["public"]["Enums"]["water_filtration_methods"][]
            | null
          fts: unknown | null
          id: number
          image: string
          ingredients: Json[] | null
          is_distilled: boolean | null
          is_indexed: boolean | null
          is_private: boolean | null
          metadata: Json | null
          name: string
          nutrients: Json[] | null
          packaging: Database["public"]["Enums"]["packaging"] | null
          recommended: boolean | null
          score: number | null
          sources: Json[] | null
          tags: string | null
          type: Database["public"]["Enums"]["item_type"]
          water_source:
            | Database["public"]["Enums"]["bottled_water_source"]
            | null
        }[]
      }
      get_random_locations: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: number
          image: string | null
          is_featured: boolean | null
          name: string
          score: number | null
          state: string | null
          type: Database["public"]["Enums"]["item_type"]
          utilities: Json[] | null
        }[]
      }
      get_users_with_favorites: {
        Args: {
          page_number?: number
          page_size?: number
        }
        Returns: {
          id: string
          full_name: string
          username: string
          is_featured: boolean
          avatar_url: string
          score: number
          total_count: number
          most_recent_favorite: string
        }[]
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          content: string
          original_table: string
          original_id: number
          similarity: number
        }[]
      }
      match_page_sections: {
        Args: {
          embedding: string
          match_threshold: number
          match_count: number
          min_content_length: number
        }
        Returns: {
          id: number
          page_id: number
          slug: string
          heading: string
          content: string
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      bottled_water_metadata: "source" | "treatment_process" | "ph_level"
      bottled_water_source:
        | "municipal_supply"
        | "mountain_spring"
        | "aquifer"
        | "iceberg"
        | "spring"
        | "well"
        | "rain"
        | "unknown"
        | "young_coconut"
        | "mature_coconut"
        | "coconut_water"
      certifications: "NSF" | "IAPMO" | "WQA" | "SGS" | "ANAB" | "ISO"
      email_subscriptions: "newsletter"
      ingredient_category:
        | "Chemical Disinfectants"
        | "Fluoride"
        | "Haloacetic Acids"
        | "Heavy Metals"
        | "Herbicides"
        | "Microplastics"
        | "Perfluorinated Chemicals (PFAS)"
        | "Pesticides"
        | "Pharmaceuticals"
        | "Phthalates"
        | "Radiological Elements"
        | "Semi-Volatile Compounds"
        | "Volatile Organic Compounds (VOCs)"
        | "Microbiologicals"
        | "Minerals"
        | "Inorganics"
        | "Other"
        | "Disinfectant by-product"
        | "Fruits"
        | "Juices"
        | "Additives"
        | "Botanicals"
        | "Sweeteners"
        | "Fibers"
        | "Prebiotics"
        | "Organic Acids"
        | "Trihalomethanes"
        | "Synthetics"
        | "Inorganic ingredients"
        | "Vitamins"
        | "Amino Acids"
      item_type:
        | "bottled_water"
        | "tap_water"
        | "filter"
        | "flavored_water"
        | "mineral_packets"
        | "water_gallon"
        | "shower_filter"
        | "bottle_filter"
        | "energy_drink"
        | "sports_drink"
        | "coconut_water"
      packaging:
        | "plastic"
        | "glass"
        | "cardboard"
        | "aluminum"
        | "aluminum (can)"
      permission: "admin" | "manager" | "user"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
      water_filtration_methods:
        | "Distillation"
        | "Reverse osmosis"
        | "Ion exchange"
        | "Ultraviolet (UV) Treatment"
        | "Carbon Filtration"
        | "Micron Filtration"
        | "Ozone Treatment"
        | "Electrodeionization"
        | "Mineral Addition"
        | "Aeration"
        | "Ionization"
        | "Natural"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
